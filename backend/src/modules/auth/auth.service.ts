import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../../common/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type TokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(payload: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: payload.email.toLowerCase() },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: payload.email.toLowerCase(),
        displayName: payload.displayName.trim(),
        authIdentity: {
          create: {
            passwordHash,
          },
        },
        profile: {
          create: {},
        },
        preference: {
          create: {
            interestTags: [],
          },
        },
      },
      include: {
        profile: true,
        preference: true,
      },
    });

    const tokens = await this.issueTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.usersService.toPublicUser(user),
      profile: user.profile,
      preferences: user.preference,
      tokens,
    };
  }

  async login(payload: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email.toLowerCase() },
      include: {
        authIdentity: true,
        profile: true,
        preference: true,
      },
    });

    if (!user?.authIdentity) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(
      payload.password,
      user.authIdentity.passwordHash,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.issueTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.usersService.toPublicUser(user),
      profile: user.profile,
      preferences: user.preference,
      tokens,
    };
  }

  async refresh(refreshToken: string) {
    let payload: TokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<TokenPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const authIdentity = await this.prisma.authIdentity.findUnique({
      where: { userId: payload.sub },
      include: {
        user: true,
      },
    });

    if (!authIdentity?.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    const tokenMatches = await bcrypt.compare(
      refreshToken,
      authIdentity.refreshTokenHash,
    );

    if (!tokenMatches) {
      throw new UnauthorizedException('Refresh token mismatch');
    }

    const tokens = await this.issueTokens({
      sub: authIdentity.user.id,
      email: authIdentity.user.email,
      role: authIdentity.user.role,
    });

    await this.storeRefreshToken(authIdentity.user.id, tokens.refreshToken);

    return {
      tokens,
    };
  }

  private async issueTokens(payload: TokenPayload) {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
      throw new UnauthorizedException('JWT secrets are not configured');
    }

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: accessSecret,
      expiresIn: process.env.ACCESS_TOKEN_TTL ?? '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: process.env.REFRESH_TOKEN_TTL ?? '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async storeRefreshToken(userId: string, refreshToken: string) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    await this.prisma.authIdentity.update({
      where: { userId },
      data: {
        refreshTokenHash,
      },
    });
  }
}

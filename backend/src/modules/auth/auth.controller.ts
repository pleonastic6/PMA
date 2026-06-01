import { Body, Controller, Post } from '@nestjs/common';

import { ok } from '../../common/http/api-response';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return ok('auth', await this.authService.register(payload));
  }

  @Post('login')
  async login(@Body() payload: LoginDto) {
    return ok('auth', await this.authService.login(payload));
  }

  @Post('refresh')
  async refresh(@Body() payload: RefreshTokenDto) {
    return ok('auth', await this.authService.refresh(payload.refreshToken));
  }
}

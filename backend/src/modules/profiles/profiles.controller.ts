import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../common/auth/current-user.decorator';
import {
  AuthenticatedUser,
  JwtAuthGuard,
} from '../../common/auth/jwt-auth.guard';
import { ok } from '../../common/http/api-response';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

@UseGuards(JwtAuthGuard)
@Controller('me/profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  async getMyProfile(@CurrentUser() user: AuthenticatedUser) {
    return ok('profiles', await this.profilesService.getMyProfile(user.sub));
  }

  @Patch()
  async updateMyProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: UpdateProfileDto,
  ) {
    return ok('profiles', await this.profilesService.updateMyProfile(user.sub, payload));
  }
}

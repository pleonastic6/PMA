import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../common/auth/current-user.decorator';
import {
  AuthenticatedUser,
  JwtAuthGuard,
} from '../../common/auth/jwt-auth.guard';
import { ok } from '../../common/http/api-response';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getCurrentUser(@CurrentUser() user: AuthenticatedUser) {
    return ok('users', await this.usersService.getCurrentUser(user.sub));
  }

  @Patch('preferences')
  async updatePreferences(
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: UpdatePreferencesDto,
  ) {
    return ok('users', await this.usersService.updatePreferences(user.sub, payload));
  }
}

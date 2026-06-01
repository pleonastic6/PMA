import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../../common/auth/current-user.decorator';
import {
  AuthenticatedUser,
  JwtAuthGuard,
} from '../../common/auth/jwt-auth.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { ok } from '../../common/http/api-response';
import { CreateBlockDto } from './dto/create-block.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { ListReportsQueryDto } from './dto/list-reports-query.dto';
import { VerificationModerationService } from './verification-moderation.service';

@UseGuards(JwtAuthGuard)
@Controller('verification-moderation')
export class VerificationModerationController {
  constructor(
    private readonly verificationModerationService: VerificationModerationService,
  ) {}

  @Get('overview')
  getOverview() {
    return ok(
      'verification_moderation',
      this.verificationModerationService.getOverview(),
    );
  }

  @Get('blocks')
  async listBlocks(@CurrentUser() user: AuthenticatedUser) {
    return ok(
      'verification_moderation',
      await this.verificationModerationService.listBlocks(user.sub),
    );
  }

  @Post('blocks')
  async createBlock(
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateBlockDto,
  ) {
    return ok(
      'verification_moderation',
      await this.verificationModerationService.createBlock(user.sub, payload),
    );
  }

  @Delete('blocks/:blockedUserId')
  async removeBlock(
    @CurrentUser() user: AuthenticatedUser,
    @Param('blockedUserId') blockedUserId: string,
  ) {
    return ok(
      'verification_moderation',
      await this.verificationModerationService.removeBlock(user.sub, blockedUserId),
    );
  }

  @Get('reports/mine')
  async listOwnReports(@CurrentUser() user: AuthenticatedUser) {
    return ok(
      'verification_moderation',
      await this.verificationModerationService.listOwnReports(user.sub),
    );
  }

  @Post('reports')
  async createReport(
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateReportDto,
  ) {
    return ok(
      'verification_moderation',
      await this.verificationModerationService.createReport(user.sub, payload),
    );
  }

  @Roles('ADMIN', 'MODERATOR')
  @Get('reports')
  async listReports(@Query() query: ListReportsQueryDto) {
    return ok(
      'verification_moderation',
      await this.verificationModerationService.listReports(query.status),
    );
  }
}

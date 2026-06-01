import { ReportStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class ListReportsQueryDto {
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;
}

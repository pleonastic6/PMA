import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(99)
  minAge?: number;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(99)
  maxAge?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  maxDistanceKm?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  interestTags?: string[];

  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;
}

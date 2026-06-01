import { SwipeDirection } from '@prisma/client';
import { IsEnum, IsString, MinLength } from 'class-validator';

export class CreateSwipeDto {
  @IsString()
  @MinLength(1)
  targetUserId!: string;

  @IsEnum(SwipeDirection)
  direction!: SwipeDirection;
}

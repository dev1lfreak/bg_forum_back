import { IsString, IsOptional, IsEnum, IsArray, IsInt } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  tagIds?: number[];
}
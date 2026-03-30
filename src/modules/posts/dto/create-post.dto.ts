import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';
import { Status } from '@prisma/client';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsArray()
  @IsOptional()
  tagIds?: number[];
}
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum PostSortField {
  CREATED_AT = 'createdAt',
  VIEW_COUNT = 'viewCount',
}

export class FindAllPostsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsEnum(PostSortField)
  sortBy?: PostSortField = PostSortField.CREATED_AT;

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'desc';
}
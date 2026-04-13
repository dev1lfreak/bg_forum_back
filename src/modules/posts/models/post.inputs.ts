import { Field, InputType, Int } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { PostSortField } from '../dto/find-all-posts.dto';
import { SortOrderGql } from './post-sort.model';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  @MinLength(1)
  title: string;

  @Field()
  @IsString()
  @MinLength(1)
  content: string;

  @Field(() => Status, { nullable: true })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];
}

@InputType()
export class UpdatePostInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;

  @Field(() => Status, { nullable: true })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];
}

@InputType()
export class FindAllPostsInput {
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  tag?: string;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number;

  @Field(() => PostSortField, { nullable: true, defaultValue: PostSortField.CREATED_AT })
  sortBy?: PostSortField;

  @Field(() => SortOrderGql, { nullable: true, defaultValue: SortOrderGql.desc })
  order?: SortOrderGql;
}


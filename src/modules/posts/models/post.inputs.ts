import { Field, InputType, Int } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { PostSortField } from '../dto/find-all-posts.dto';
import { SortOrderGql } from './post-sort.model';

@InputType()
export class CreatePostInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => Status, { nullable: true })
  status?: Status;

  @Field(() => [Int], { nullable: true })
  tagIds?: number[];
}

@InputType()
export class UpdatePostInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => Status, { nullable: true })
  status?: Status;

  @Field(() => [Int], { nullable: true })
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


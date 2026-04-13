import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { TagGql } from './tag.model';

@ObjectType()
export class PostGql {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => Status)
  status: Status;

  @Field(() => Int)
  viewCount: number;

  @Field(() => Int)
  rating: number;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @Field(() => Int)
  authorId: number;

  @Field({ nullable: true })
  authorUsername?: string;

  @Field(() => [TagGql], { nullable: true })
  tags?: TagGql[];
}

@ObjectType()
export class PostsPageGql {
  @Field(() => [PostGql])
  items: PostGql[];

  @Field(() => Int)
  total: number;
}


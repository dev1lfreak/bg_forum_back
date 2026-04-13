import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class CommentGql {
  @Field(() => Int)
  id: number;

  @Field()
  text: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => Int)
  authorId: number;

  @Field(() => Int)
  postId: number;

  @Field({ nullable: true })
  authorUsername?: string;
}


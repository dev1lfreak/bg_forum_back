import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  text: string;

  @Field(() => Int)
  postId: number;
}

@InputType()
export class UpdateCommentInput {
  @Field(() => Int)
  id: number;

  @Field()
  text: string;
}


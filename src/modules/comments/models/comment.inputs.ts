import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  text: string;

  @Field(() => Int)
  @IsInt()
  postId: number;
}

@InputType()
export class UpdateCommentInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  text: string;
}


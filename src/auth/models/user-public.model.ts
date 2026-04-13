import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserPublicGql {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  username: string;
}

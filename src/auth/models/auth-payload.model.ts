import { Field, ObjectType } from '@nestjs/graphql';
import { UserPublicGql } from './user-public.model';

@ObjectType()
export class AuthPayloadGql {
  @Field()
  accessToken: string;

  @Field(() => UserPublicGql)
  user: UserPublicGql;
}
 
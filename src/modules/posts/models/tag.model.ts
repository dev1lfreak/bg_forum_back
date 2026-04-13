import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TagGql {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}


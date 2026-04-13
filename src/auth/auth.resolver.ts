import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterInput } from './models/register.input';
import { LoginInput } from './models/login.input';
import { AuthPayloadGql } from './models/auth-payload.model';
import { UserPublicGql } from './models/user-public.model';
import { GqlJwtAuthGuard } from './gql-jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import type { CurrentUser as CurrentUserPayload } from '../common/http/current-user';
import { UsersService } from '../modules/users/users.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => AuthPayloadGql)
  register(@Args('input') input: RegisterInput) {
    return this.authService.registerGql(input);
  }

  @Mutation(() => AuthPayloadGql)
  login(@Args('input') input: LoginInput) {
    return this.authService.loginGql(input);
  }

  @Query(() => UserPublicGql, { name: 'me' })
  @UseGuards(GqlJwtAuthGuard)
  me(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.findById(user.id);
  }
}

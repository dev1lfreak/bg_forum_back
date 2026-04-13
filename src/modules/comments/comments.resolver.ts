import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentGql } from './models/comment.model';
import { CreateCommentInput, UpdateCommentInput } from './models/comment.inputs';
import { CurrentUser } from '../../auth/current-user.decorator';
import type { CurrentUser as CurrentUserPayload } from '../../common/http/current-user';
import { GqlJwtAuthGuard } from '../../auth/gql-jwt-auth.guard';

@Resolver(() => CommentGql)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query(() => [CommentGql])
  async commentsByPost(@Args('postId', { type: () => Int }) postId: number): Promise<CommentGql[]> {
    const items: any[] = await this.commentsService.findByPost(postId);
    return items.map((c: any) => ({ ...c, authorUsername: c.author?.username }));
  }

  @Query(() => CommentGql)
  async comment(@Args('id', { type: () => Int }) id: number): Promise<CommentGql> {
    const c: any = await this.commentsService.findById(id);
    return { ...c, authorUsername: c.author?.username };
  }

  @Mutation(() => CommentGql)
  @UseGuards(GqlJwtAuthGuard)
  async createComment(
    @Args('input', { type: () => CreateCommentInput }) input: CreateCommentInput,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<CommentGql> {
    const created: any = await this.commentsService.create(user.id, input);
    return { ...created, authorUsername: created.author?.username };
  }

  @Mutation(() => CommentGql)
  @UseGuards(GqlJwtAuthGuard)
  async updateComment(
    @Args('input', { type: () => UpdateCommentInput }) input: UpdateCommentInput,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<CommentGql> {
    const { id, text } = input;
    const updated: any = await this.commentsService.update(id, { text }, user);
    const full: any = await this.commentsService.findById(updated.id);
    return { ...full, authorUsername: full.author?.username };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlJwtAuthGuard)
  async deleteComment(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<boolean> {
    await this.commentsService.remove(id, user);
    return true;
  }
}


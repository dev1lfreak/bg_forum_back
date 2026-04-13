import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PostsService } from './posts.service';
import { CurrentUser } from '../../auth/current-user.decorator';
import type { CurrentUser as CurrentUserPayload } from '../../common/http/current-user';
import { GqlJwtAuthGuard } from '../../auth/gql-jwt-auth.guard';
import { OptionalGqlJwtAuthGuard } from '../../auth/optional-gql-jwt-auth.guard';
import { CreatePostInput, FindAllPostsInput, UpdatePostInput } from './models/post.inputs';
import { PostGql, PostsPageGql } from './models/post.model';
import './models/post-sort.model';

@Resolver(() => PostGql)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => PostsPageGql)
  @UseGuards(OptionalGqlJwtAuthGuard)
  async posts(
    @Args('input', { type: () => FindAllPostsInput, nullable: true }) input: FindAllPostsInput | undefined,
    @CurrentUser() user: CurrentUserPayload | undefined,
  ): Promise<PostsPageGql> {
    const isAdminOrAuthor = !!user && (user.role === Role.admin || user.role === Role.author);
    const { items, total } = await this.postsService.findAll(
      {
        search: input?.search,
        tag: input?.tag,
        limit: input?.limit ?? 10,
        offset: input?.offset ?? 0,
        sortBy: input?.sortBy,
        order: input?.order,
      },
      isAdminOrAuthor,
    );

    return {
      total,
      items: items.map((p: any) => ({
        ...p,
        authorUsername: p.author?.username,
        tags: p.tags?.map((t: any) => t.tag),
      })),
    };
  }

  @Query(() => PostGql)
  @UseGuards(OptionalGqlJwtAuthGuard)
  async post(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload | undefined,
  ): Promise<PostGql> {
    const p: any = await this.postsService.findById(id);
    const isAdminOrAuthor = !!user && (user.role === Role.admin || user.role === Role.author);
    if (p.status === 'Draft' && !isAdminOrAuthor) {
      throw new NotFoundException('Post not found');
    }
    return {
      ...p,
      authorUsername: p.author?.username,
      tags: p.tags?.map((t: any) => t.tag),
    };
  }

  @Mutation(() => PostGql)
  @UseGuards(GqlJwtAuthGuard)
  async createPost(
    @Args('input', { type: () => CreatePostInput }) input: CreatePostInput,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<PostGql> {
    const created: any = await this.postsService.create(user.id, input);
    const full: any = await this.postsService.findById(created.id);
    return {
      ...full,
      authorUsername: full.author?.username,
      tags: full.tags?.map((t: any) => t.tag),
    };
  }

  @Mutation(() => PostGql)
  @UseGuards(GqlJwtAuthGuard)
  async updatePost(
    @Args('input', { type: () => UpdatePostInput }) input: UpdatePostInput,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<PostGql> {
    const { id, ...dto } = input;
    const updated: any = await this.postsService.update(id, dto, user);
    const full: any = await this.postsService.findById(updated.id);
    return {
      ...full,
      authorUsername: full.author?.username,
      tags: full.tags?.map((t: any) => t.tag),
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlJwtAuthGuard)
  async deletePost(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<boolean> {
    await this.postsService.remove(id, user);
    return true;
  }
}


import { Body, Controller, Delete, Get, Header, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/optional-jwt-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import type { CurrentUser as CurrentUserPayload } from '../../common/http/current-user';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { EtagInterceptor } from '../../common/interceptors/etag.interceptor';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreatePostDto) {
    return this.postsService.create(user.id, dto);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @UseInterceptors(EtagInterceptor)
  @Header('Cache-Control', 'public, max-age=3600, must-revalidate')
  findAll(
    @Query() query: FindAllPostsDto,
    @CurrentUser() user: CurrentUserPayload | undefined,
  ) {
    const isAdminOrAuthor =
      !!user && (user.role === Role.admin || user.role === Role.author);
    return this.postsService.findAll(query, isAdminOrAuthor);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.postsService.update(Number(id), dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    await this.postsService.remove(Number(id), user);
  }
}

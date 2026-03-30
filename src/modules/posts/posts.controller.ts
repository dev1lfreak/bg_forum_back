import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { getCurrentUserFromHeaders } from '../../common/http/current-user';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Headers() headers: Record<string, unknown>, @Body() dto: CreatePostDto) {
    const currentUser = getCurrentUserFromHeaders(headers);
    return this.postsService.create(currentUser.id, dto);
  }

  @Get()
  findAll(@Query() query: FindAllPostsDto, @Headers() headers: Record<string, unknown>) {
    const currentUser = getCurrentUserFromHeaders(headers);
    const isAdminOrAuthor = currentUser.role === 'admin' || currentUser.role === 'author';
    return this.postsService.findAll(query, isAdminOrAuthor);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Headers() headers: Record<string, unknown>,
  ) {
    const currentUser = getCurrentUserFromHeaders(headers);
    return this.postsService.update(Number(id), dto, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers() headers: Record<string, unknown>) {
    const currentUser = getCurrentUserFromHeaders(headers);
    return this.postsService.remove(Number(id), currentUser);
  }
}


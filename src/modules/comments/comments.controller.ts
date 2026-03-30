import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { getCurrentUserFromHeaders } from '../../common/http/current-user';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Headers() headers: Record<string, unknown>, @Body() dto: CreateCommentDto) {
    const currentUser = getCurrentUserFromHeaders(headers);
    return this.commentsService.create(currentUser.id, dto);
  }

  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.commentsService.findByPost(Number(postId));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @Headers() headers: Record<string, unknown>,
  ) {
    const currentUser = getCurrentUserFromHeaders(headers);
    return this.commentsService.update(Number(id), dto, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers() headers: Record<string, unknown>) {
    const currentUser = getCurrentUserFromHeaders(headers);
    return this.commentsService.remove(Number(id), currentUser);
  }
}


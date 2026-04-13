import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import type { CurrentUser as CurrentUserPayload } from '../../common/http/current-user';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { FindBookmarksDto } from './dto/find-bookmarks.dto';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('toggle')
  @UseGuards(JwtAuthGuard)
  toggle(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateBookmarkDto) {
    return this.bookmarksService.toggle(user.id, dto.postId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllByUser(@CurrentUser() user: CurrentUserPayload, @Query() query: FindBookmarksDto) {
    return this.bookmarksService.findAllByUser(user.id, query);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async removeAll(@CurrentUser() user: CurrentUserPayload) {
    await this.bookmarksService.removeAll(user.id);
  }
}

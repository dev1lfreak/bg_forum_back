import { Body, Controller, Delete, Get, Headers, Post, Query } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { FindBookmarksDto } from './dto/find-bookmarks.dto';
import { getCurrentUserFromHeaders } from '../../common/http/current-user';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('toggle')
  toggle(@Headers() headers: Record<string, unknown>, @Body() dto: CreateBookmarkDto) {
    const currentUser = getCurrentUserFromHeaders(headers);
    return this.bookmarksService.toggle(currentUser.id, dto.postId);
  }

  @Get()
  findAllByUser(@Headers() headers: Record<string, unknown>, @Query() query: FindBookmarksDto) {
    const currentUser = getCurrentUserFromHeaders(headers);
    return this.bookmarksService.findAllByUser(currentUser.id, query);
  }

  @Delete()
  removeAll(@Headers() headers: Record<string, unknown>) {
    const currentUser = getCurrentUserFromHeaders(headers);
    this.bookmarksService.removeAll(currentUser.id);
  }
}


import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { BookmarksController } from './bookmarks.controller';

@Module({
  imports: [PrismaModule],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule {}
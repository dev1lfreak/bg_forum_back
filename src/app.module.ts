import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { UsersModule } from './modules/users/users.module';
import { TagsModule } from './modules/tags/tags.module';
import { BookmarksModule } from './modules/interactions/bookmarks.module';

@Module({
  imports: [PrismaModule, UsersModule, PostsModule, CommentsModule, TagsModule, BookmarksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

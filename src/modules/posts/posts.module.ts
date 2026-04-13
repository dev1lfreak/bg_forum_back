import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { PostsController } from './posts.controller';
import { PostsResolver } from './posts.resolver';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [PostsController],
  providers: [PostsService, PostsResolver],
  exports: [PostsService],
})
export class PostsModule {}
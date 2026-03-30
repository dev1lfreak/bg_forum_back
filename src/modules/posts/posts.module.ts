import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { PostsController } from './posts.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
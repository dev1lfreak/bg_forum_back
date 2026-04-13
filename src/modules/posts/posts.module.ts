import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { PostsController } from './posts.controller';
import { PostsResolver } from './posts.resolver';
import { EtagInterceptor } from '../../common/interceptors/etag.interceptor';

@Module({
  imports: [PrismaModule, UsersModule, CacheModule.register({ ttl: 5_000, max: 100 })],
  controllers: [PostsController],
  providers: [PostsService, PostsResolver, EtagInterceptor],
  exports: [PostsService],
})
export class PostsModule {}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FindBookmarksDto } from './dto/find-bookmarks.dto';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  // Тоггл закладки для поста (создать, если нет; удалить, если есть)
  async toggle(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const bookmark = await this.prisma.bookmark.findFirst({
      where: { userId, postId },
    });

    if (bookmark) {
      await this.prisma.bookmark.delete({ where: { id: bookmark.id } });
    } else {
      await this.prisma.bookmark.create({ data: { userId, postId } });
    }
  }

  // Поиск всех закладок пользователя
  async findAllByUser(userId: number, query: FindBookmarksDto) {
    const { limit, offset } = query;

    const [items, total] = await Promise.all([
      this.prisma.bookmark.findMany({
        where: { userId },
        take: limit,
        skip: offset,
        include: {
          post: {
            include: {
              author: { select: { username: true } },
              tags: { include: { tag: true } }
            }
          }
        },
        orderBy: { id: 'desc' }
      }),
      this.prisma.bookmark.count({ where: { userId } })
    ]);

    return { items, total};
  }

  // Очистка всех закладок пользователя
  async removeAll(userId: number) {
    await this.prisma.bookmark.deleteMany({
      where: { userId }
    });
  }
}
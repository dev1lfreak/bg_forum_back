import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { Status, Prisma, Role } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  // Валидация существования тегов перед созданием или обновлением поста
  private async validateTags(tagIds: number[]) {
    const existingTags = await this.prisma.tag.findMany({
      where: { id: { in: tagIds } },
    });
    if (existingTags.length !== tagIds.length) {
      throw new BadRequestException('One or more tags do not exist');
    }
  }

  // Создание нового поста
  async create(authorId: number, dto: CreatePostDto) {
    if (dto.tagIds?.length) await this.validateTags(dto.tagIds);

    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        status: dto.status || Status.Draft,
        rating: 0,
        authorId,
        tags: {
          create: dto.tagIds?.map((id) => ({ tagId: id })),
        },
      },
    });
  }

  // Функция для получения всех постов с поддержкой фильтрации, пагинации и сортировки
  async findAll(query: FindAllPostsDto, isAdminOrAuthor: boolean = false) {
    const { search, tag, limit, offset, sortBy, order } = query;

    const where: Prisma.PostWhereInput = {
      status: isAdminOrAuthor ? undefined : Status.Published,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tag) {
      where.tags = {
        some: {
          tag: { name: tag },
        },
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { [sortBy as string]: order },
        include: {
          author: { select: { username: true } },
          tags: { include: { tag: true } },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { username: true } },
        tags: { include: { tag: true } },
      },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async incrementView(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      include: {
        author: { select: { username: true } },
        tags: { include: { tag: true } }
      }
    });
  }

  async vote(id: number, delta: number) {
    if (![1, -1].includes(delta)) {
      throw new BadRequestException('Vote delta must be 1 or -1');
    }
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.post.update({
      where: { id },
      data: { rating: { increment: delta } },
      include: {
        author: { select: { username: true } },
        tags: { include: { tag: true } }
      }
    });
  }

  // Обновление поста
  async update(id: number, dto: UpdatePostDto, currentUser: { id: number; role: Role }) {
    const post = await this.prisma.post.findUnique({ where: { id: id } });
    if (!post) throw new NotFoundException('Post not found');

    this.usersService.validateAccess(post.authorId, currentUser);
    if (dto.tagIds) await this.validateTags(dto.tagIds);

    return this.prisma.$transaction(async (tx) => {
      if (dto.tagIds) {
        await tx.p_TEGS.deleteMany({ where: { postId: id } });
        if (dto.tagIds.length > 0) {
          await tx.p_TEGS.createMany({
            data: dto.tagIds.map((tagId) => ({ postId: id, tagId })),
          });
        }
      }

      const { tagIds, ...data } = dto;
      return tx.post.update({
        where: { id },
        data,
      });
    });
  }

  // Удаление поста
  async remove(postId: number, currentUser: { id: number; role: Role }) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    this.usersService.validateAccess(post.authorId, currentUser);

    return this.prisma.$transaction([
      this.prisma.p_TEGS.deleteMany({ where: { postId } }),
      this.prisma.post.delete({ where: { id: postId } }),
    ]);
  }
}
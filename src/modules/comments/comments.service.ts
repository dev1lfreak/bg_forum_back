import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Role } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  // Создание комментария
  async create(authorId: number, dto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({ where: { id: dto.postId } });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.comment.create({
      data: {
        text: dto.text,
        authorId: authorId,
        postId: dto.postId,
      },
      include: { author: { select: { username: true } } },
    });
  }

  // Редактирование комментария
  async update(id: number, dto: UpdateCommentDto, currentUser: { id: number; role: Role }) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    this.usersService.validateAccess(comment.authorId, currentUser);

    return this.prisma.comment.update({
      where: { id },
      data: { text: dto.text },
    });
  }

  // Удаление комментария
  async remove(id: number, currentUser: { id: number; role: Role }) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    this.usersService.validateAccess(comment.authorId, currentUser);

    await this.prisma.comment.delete({ where: { id } });
  }

  // Получение комментариев по ID поста
  async findByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: { author: { select: { username: true } } },
    });
  }

  async findById(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { author: { select: { username: true } } },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }
}
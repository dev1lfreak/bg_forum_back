import { 
  Injectable, 
  ConflictException, 
  NotFoundException, 
  ForbiddenException,
  UnauthorizedException 
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(private prisma: PrismaService) {}

  /** Для логина / выдачи JWT (включает password). Не использовать в публичных ответах. */
  findForAuthByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // Создание пользователя
  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.saltRounds);

    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
  }

  async findAll(currentUser: { id: number; role: Role }) {
    if (currentUser.role !== Role.admin) {
      throw new ForbiddenException('Only admin can view users list');
    }

    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        email: true,
        username: true,
        role: true
      }
    });
  }

  // Поиск пользователя по id
  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Обновление данных пользователя
  async update(id: number, dto: UpdateUserDto, currentUser: { id: number; role: Role }) {
    const userToUpdate = await this.prisma.user.findUnique({ where: { id } });
    if (!userToUpdate) throw new NotFoundException();
    this.validateAccess(userToUpdate.id, currentUser);

    const data = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, this.saltRounds);
    }
    if (dto.role && currentUser.role !== Role.admin) {
      throw new ForbiddenException('Only admin can change user role');
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
  }

  async updateRole(id: number, role: Role, currentUser: { id: number; role: Role }) {
    if (currentUser.role !== Role.admin) {
      throw new ForbiddenException('Only admin can change user role');
    }

    const userToUpdate = await this.prisma.user.findUnique({ where: { id } });
    if (!userToUpdate) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
  }

  // Удаление пользователя
  async remove(id: number, currentUser: { id: number; role: Role }) {
    const userToDelete = await this.prisma.user.findUnique({ where: { id } });
    if (!userToDelete) throw new NotFoundException();

    this.validateAccess(userToDelete.id, currentUser);

    return this.prisma.$transaction([
      this.prisma.bookmark.deleteMany({ where: { userId: id } }),
      this.prisma.rating.deleteMany({ where: { userId: id } }),
      this.prisma.comment.deleteMany({ where: { authorId: id } }),
      this.prisma.post.deleteMany({ where: { authorId: id } }),
      this.prisma.user.delete({ where: { id } }),
    ]);
  }

  // Получение публичного профиля
  async getPublicProfile(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        _count: {
          select: { 
            posts: true, 
            comments: true 
          }
        }
      }
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Смена пароля
  async changePassword(
    userId: number,
    dto: ChangePasswordDto,
    currentUser: { id: number; role: Role },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException();

    this.validateAccess(userId, currentUser);

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, this.saltRounds);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  // Валидация доступа к ресурсам
  validateAccess(resourceOwnerId: number, currentUser: { id: number; role: Role }) {
    const isOwner = resourceOwnerId === currentUser.id;
    const isAdmin = currentUser.role === Role.admin;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }
    return true;
  }
}
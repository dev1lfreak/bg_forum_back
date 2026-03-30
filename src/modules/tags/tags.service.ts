import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  ForbiddenException 
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Role } from '@prisma/client';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  // Проверка прав доступа
  private validateAdmin(role: Role) {
    if (role !== Role.admin) {
      throw new ForbiddenException('Only admins can manage tags');
    }
  }

  // Создание нового тега
  async create(dto: CreateTagDto, currentUserRole: Role) {
    this.validateAdmin(currentUserRole);

    const existing = await this.prisma.tag.findUnique({ 
      where: { name: dto.name } 
    });
    if (existing) throw new ConflictException('Tag already exists');

    return this.prisma.tag.create({ data: dto });
  }

  // Обновление существующего тега
  async update(id: number, dto: UpdateTagDto, currentUserRole: Role) {
    this.validateAdmin(currentUserRole);

    await this.findOne(id);

    return this.prisma.tag.update({
      where: { id },
      data: dto
    });
  }

  // Удаление тега
  async remove(id: number, currentUserRole: Role) {
    this.validateAdmin(currentUserRole);

    await this.findOne(id);

    await this.prisma.tag.delete({ where: { id } });
  }

  // Получение всех тегов
  async findAll() {
    return this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } }
    });
  }

  // Получение одного тега по ID
  async findOne(id: number) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException(`Tag not found`);
    return tag;
  }
}
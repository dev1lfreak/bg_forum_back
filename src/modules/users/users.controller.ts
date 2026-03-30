import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { getCurrentUserFromHeaders } from '../../common/http/current-user';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(Number(id));
  }

  @Get('profile/:username')
  getPublicProfile(@Param('username') username: string) {
    return this.usersService.getPublicProfile(username);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Headers() headers: Record<string, unknown>,
  ) {
    const currentUser = getCurrentUserFromHeaders(headers);
    return this.usersService.update(Number(id), dto, currentUser);
  }

  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
    @Headers() headers: Record<string, unknown>,
  ) {
    const currentUser = getCurrentUserFromHeaders(headers);
    return this.usersService.updateRole(Number(id), dto.role, currentUser);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Headers() headers: Record<string, unknown>) {
    const currentUser = getCurrentUserFromHeaders(headers);
    await this.usersService.remove(Number(id), currentUser);
  }

  @Post(':id/change-password')
  changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(Number(id), dto);
  }
}


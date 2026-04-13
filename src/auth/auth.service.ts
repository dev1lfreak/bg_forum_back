import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { UsersService } from '../modules/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterInput } from './models/register.input';
import { LoginInput } from './models/login.input';
import { AuthPayloadGql } from './models/auth-payload.model';

export type AuthRestResponse = {
  access_token: string;
  user: { id: number; email: string; username: string };
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private issueAccessToken(user: { id: number; role: Role }) {
    return this.jwtService.sign({ sub: user.id, role: user.role });
  }

  private toPublicUser(user: { id: number; email: string; username: string }) {
    return { id: user.id, email: user.email, username: user.username };
  }

  async validateUserForLogin(email: string, password: string) {
    const user = await this.usersService.findForAuthByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  async login(dto: LoginDto): Promise<AuthRestResponse> {
    const user = await this.validateUserForLogin(dto.email, dto.password);
    return {
      access_token: this.issueAccessToken(user),
      user: this.toPublicUser(user),
    };
  }

  async register(dto: RegisterDto): Promise<AuthRestResponse> {
    const created = await this.usersService.create({
      email: dto.email,
      username: dto.username,
      password: dto.password,
    });
    const user = await this.usersService.findForAuthByEmail(created.email);
    if (!user) {
      throw new UnauthorizedException('Registration failed');
    }
    return {
      access_token: this.issueAccessToken(user),
      user: this.toPublicUser(user),
    };
  }

  async registerGql(input: RegisterInput): Promise<AuthPayloadGql> {
    const rest = await this.register(input);
    return {
      accessToken: rest.access_token,
      user: rest.user,
    };
  }

  async loginGql(input: LoginInput): Promise<AuthPayloadGql> {
    const rest = await this.login(input);
    return {
      accessToken: rest.access_token,
      user: rest.user,
    };
  }
}

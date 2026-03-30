import { User, Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  id: number;
  email: string;
  username: string;
  
  @Exclude()
  password: string;
  
  role: Role;
  theme: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
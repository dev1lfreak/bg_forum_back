import { Post, Status } from '@prisma/client';

export class PostEntity implements Post {
  id: number;
  title: string;
  content: string;
  status: Status;
  viewCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;

  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial);
  }
}
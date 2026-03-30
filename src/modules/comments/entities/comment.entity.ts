import { Comment } from '@prisma/client';

export class CommentEntity implements Comment {
  id: number;
  text: string;
  createdAt: Date;
  authorId: number;
  postId: number;

  constructor(partial: Partial<CommentEntity>) {
    Object.assign(this, partial);
  }
}
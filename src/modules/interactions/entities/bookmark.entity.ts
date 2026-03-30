import { Bookmark } from '@prisma/client';

export class BookmarkEntity implements Bookmark {
  id: number;
  userId: number;
  postId: number;

  constructor(partial: Partial<BookmarkEntity>) {
    Object.assign(this, partial);
  }
}
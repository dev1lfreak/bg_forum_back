import { Tag } from '@prisma/client';

export class TagEntity implements Tag {
  id: number;
  name: string;

  constructor(partial: Partial<TagEntity>) {
    Object.assign(this, partial);
  }
}
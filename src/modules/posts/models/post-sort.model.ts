import { registerEnumType } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { PostSortField } from '../dto/find-all-posts.dto';

export enum SortOrderGql {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(Status, { name: 'PostStatus' });
registerEnumType(PostSortField, { name: 'PostSortField' });
registerEnumType(SortOrderGql, { name: 'SortOrder' });


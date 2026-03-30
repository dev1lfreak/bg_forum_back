import { Role } from '@prisma/client';

export type CurrentUser = { id: number; role: Role };

function toInt(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value !== 'string') return undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  return Math.trunc(n);
}

function toRole(value: unknown): Role | undefined {
  if (typeof value !== 'string') return undefined;
  if (value === Role.admin || value === Role.author || value === Role.user) return value;
  return undefined;
}

export function getCurrentUserFromHeaders(headers: Record<string, unknown>): CurrentUser {
  const id = toInt(headers['x-user-id']) ?? 1;
  const role = toRole(headers['x-user-role']) ?? Role.user;
  return { id, role };
}


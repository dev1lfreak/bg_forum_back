import { Role } from '@prisma/client';

/** Пользователь из JWT после Passport (`JwtStrategy.validate`). */
export type CurrentUser = { id: number; role: Role };

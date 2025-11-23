import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        phone: string | null;
        role: UserRole;
      };
    }
  }
}

export {};


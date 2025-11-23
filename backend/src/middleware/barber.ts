import { Request, Response, NextFunction } from 'express';

export const requireBarber = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  if ((req.user.role as string) !== 'barber') {
    res.status(403).json({ error: 'Barber access required' });
    return;
  }

  next();
};


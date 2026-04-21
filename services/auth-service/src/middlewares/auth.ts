import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import redis from '../config/redis'; // ✅ FIXED

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // 🔥 Check Redis first
    const cachedSession = await redis.get(`session:${token}`);

    if (cachedSession) {
      console.log("⚡ From Redis Session");
      req.user = JSON.parse(cachedSession);
      return next();
    }

    // fallback JWT
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = decoded;

    next();

  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
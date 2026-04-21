import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Robust Header extraction: handles "Bearer token", "Bearer  token", etc.
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      console.log("Auth failed: No token provided");
      return res.status(401).json({ error: 'No token provided' });
    }

    // Check if JWT_SECRET is loaded
    if (!process.env.JWT_SECRET) {
      console.error("FATAL: JWT_SECRET is not defined in .env");
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();

  } catch (error: any) {
    // Permanent Fix: Log why auth failed so you can debug
    console.error("Auth Error Details:", error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.status(401).json({ error: 'Unauthorized' });
  }
};
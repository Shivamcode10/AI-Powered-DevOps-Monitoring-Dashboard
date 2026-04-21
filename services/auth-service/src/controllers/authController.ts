import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redis from '../config/redis'; // ✅ FIXED IMPORT

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });

    res.status(201).json({
      id: user._id,
      email: user.email,
      name: user.name
    });

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    // 🔥 Redis session cache
    await redis.set(
      `session:${token}`,
      JSON.stringify({
        id: user._id,
        email: user.email,
        name: user.name
      }),
      "EX",
      86400
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
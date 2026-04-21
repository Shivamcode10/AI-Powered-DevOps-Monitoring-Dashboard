import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, (req, res) => res.json(req.user));

export default router;
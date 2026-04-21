import { Router } from 'express';
import { createBooking, getBookings } from '../controllers/bookingController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// 🔐 Protected routes
router.use(authenticate);

router.post('/', createBooking);
router.get('/', getBookings);

export default router;
import express from 'express';
import { getActivityFeed } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/feed - Retrieve chronological paginated activity feed for logged-in user
router.get('/', protect, getActivityFeed);

export default router;

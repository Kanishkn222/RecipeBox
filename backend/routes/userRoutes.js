import express from 'express';
import {
  followUser,
  unfollowUser,
  getUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Profile routes
router.get('/profile/:username', getUserProfile);

// Private Follow/Unfollow routes
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

export default router;

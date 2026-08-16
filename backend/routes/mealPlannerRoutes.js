import express from 'express';
import {
  scheduleMeal,
  getMealPlans,
  deleteMealPlan,
} from '../controllers/mealPlannerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce auth on all meal planner scheduling endpoints
router.use(protect);

router.route('/')
  .post(scheduleMeal)
  .get(getMealPlans);

router.route('/:id')
  .delete(deleteMealPlan);

export default router;

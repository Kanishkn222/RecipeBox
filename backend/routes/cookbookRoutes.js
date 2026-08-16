import express from 'express';
import {
  createCookbook,
  getCookbooks,
  getCookbookById,
  addRecipeToCookbook,
  removeRecipeFromCookbook,
  deleteCookbook,
} from '../controllers/cookbookController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce authentication on all cookbook routes
router.use(protect);

router.route('/')
  .post(createCookbook)
  .get(getCookbooks);

router.route('/:id')
  .get(getCookbookById)
  .delete(deleteCookbook);

router.route('/:id/recipes')
  .post(addRecipeToCookbook);

router.route('/:id/recipes/:recipeId')
  .delete(removeRecipeFromCookbook);

export default router;

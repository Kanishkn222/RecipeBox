import express from 'express';
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addRecipeReview,
} from '../controllers/recipeController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public / Discovery Engine routes
// Optional auth is applied to GET / so that if a user is logged in, we have their ID in req.user
router.route('/')
  .get(optionalProtect, getRecipes)
  .post(protect, uploadSingleImage, createRecipe);

router.route('/:id')
  .get(getRecipeById)
  .put(protect, uploadSingleImage, updateRecipe)
  .delete(protect, deleteRecipe);

router.route('/:id/reviews')
  .post(protect, addRecipeReview);

export default router;

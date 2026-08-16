import mongoose from 'mongoose';
import Recipe from '../models/Recipe.js';
import { uploadToCloudinaryStream } from '../config/cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Helper to parse fields that may be stringified JSON when submitted via multipart/form-data
 */
const parseJsonField = (field, fallback) => {
  if (field === undefined || field === null) return fallback;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      return fallback;
    }
  }
  return field;
};

// @desc    Get all recipes (Discovery Engine with Advanced Filtering & Pagination)
// @route   GET /api/recipes
// @access  Public
export const getRecipes = async (req, res) => {
  try {
    const {
      search,
      tags,
      difficulty,
      maxTime,
      ingredients,
      excludeIngredients,
      author,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    const matchStage = {};

    // 1. Text search stage (Title and Description)
    if (search) {
      matchStage.$text = { $search: search };
    }

    // 2. Difficulty exact match
    if (difficulty) {
      matchStage.difficulty = difficulty;
    }

    // 3. Cook + Prep time limit (utilizes the pre-calculated totalTime index)
    if (maxTime) {
      matchStage.totalTime = { $lte: Number(maxTime) };
    }

    // 4. Tags filtering (matches if recipe contains ALL requested tags)
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
      if (tagsArray.length > 0) {
        matchStage.tags = { $all: tagsArray.map((t) => new RegExp(`^${t}$`, 'i')) };
      }
    }

    // 5. Inclusive Ingredients (recipe MUST contain all of these)
    if (ingredients) {
      const incArray = Array.isArray(ingredients) ? ingredients : ingredients.split(',').map((i) => i.trim());
      if (incArray.length > 0) {
        matchStage['ingredients.name'] = { $all: incArray.map((ing) => new RegExp(ing, 'i')) };
      }
    }

    // 6. Exclusive Ingredients (recipe MUST NOT contain any of these)
    if (excludeIngredients) {
      const excArray = Array.isArray(excludeIngredients) ? excludeIngredients : excludeIngredients.split(',').map((i) => i.trim());
      if (excArray.length > 0) {
        const excRegex = excArray.map((ing) => new RegExp(ing, 'i'));
        if (matchStage['ingredients.name']) {
          matchStage['ingredients.name'].$nin = excRegex;
        } else {
          matchStage['ingredients.name'] = { $nin: excRegex };
        }
      }
    }

    // 7. Author exact match
    if (author) {
      matchStage.author = new mongoose.Types.ObjectId(author);
    }

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skipNum = (pageNum - 1) * limitNum;

    // Define Sorting
    let sortStage = { createdAt: -1 }; // default: newest first
    if (sortBy === 'rating') {
      sortStage = { averageRating: -1 };
    } else if (sortBy === 'time') {
      sortStage = { totalTime: 1 };
    } else if (search) {
      // Sort by text relevance score if search query is active
      sortStage = { score: { $meta: 'textScore' } };
    }

    // Build the aggregation pipeline
    const pipeline = [];

    // Always start with $match
    pipeline.push({ $match: matchStage });

    // Project textScore if text search was used
    if (search) {
      pipeline.push({
        $project: {
          title: 1,
          description: 1,
          prepTime: 1,
          cookTime: 1,
          totalTime: 1,
          servings: 1,
          difficulty: 1,
          ingredients: 1,
          instructions: 1,
          tags: 1,
          nutritionalInfo: 1,
          imageUrl: 1,
          imagePublicId: 1,
          author: 1,
          ratings: 1,
          averageRating: 1,
          createdAt: 1,
          updatedAt: 1,
          score: { $meta: 'textScore' },
        },
      });
    }

    // Apply Sorting
    pipeline.push({ $sort: sortStage });

    // Run pagination and item retrieval in parallel using $facet
    pipeline.push({
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [
          { $skip: skipNum },
          { $limit: limitNum },
          // Lookup author profile picture and name
          {
            $lookup: {
              from: 'users',
              localField: 'author',
              foreignField: '_id',
              as: 'authorDetails',
            },
          },
          {
            $unwind: {
              path: '$authorDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              title: 1,
              description: 1,
              prepTime: 1,
              cookTime: 1,
              totalTime: 1,
              servings: 1,
              difficulty: 1,
              ingredients: 1,
              instructions: 1,
              tags: 1,
              nutritionalInfo: 1,
              imageUrl: 1,
              imagePublicId: 1,
              ratings: 1,
              averageRating: 1,
              createdAt: 1,
              author: {
                _id: '$authorDetails._id',
                username: '$authorDetails.username',
                profilePicture: '$authorDetails.profilePicture',
              },
            },
          },
        ],
      },
    });

    const results = await Recipe.aggregate(pipeline);

    const total = results[0]?.metadata[0]?.total || 0;
    const recipes = results[0]?.data || [];
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      count: recipes.length,
      total,
      totalPages,
      currentPage: pageNum,
      recipes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username profilePicture bio')
      .populate('ratings.user', 'username profilePicture');

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.json({ success: true, recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a recipe
// @route   POST /api/recipes
// @access  Private
export const createRecipe = async (req, res) => {
  try {
    const { title, description, prepTime, cookTime, servings, difficulty } = req.body;

    // Parse JSON arrays/objects from multipart form-data
    const ingredients = parseJsonField(req.body.ingredients, []);
    const instructions = parseJsonField(req.body.instructions, []);
    const tags = parseJsonField(req.body.tags, []);
    const nutritionalInfo = parseJsonField(req.body.nutritionalInfo, { calories: 0, protein: 0, carbohydrates: 0, fat: 0 });

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a recipe image' });
    }

    // Stream upload image to Cloudinary
    const uploadResult = await uploadToCloudinaryStream(req.file.buffer, 'recipebox/recipes', title);

    const newRecipe = new Recipe({
      title,
      description,
      prepTime: Number(prepTime),
      cookTime: Number(cookTime),
      servings: Number(servings),
      difficulty,
      ingredients,
      instructions,
      tags,
      nutritionalInfo,
      imageUrl: uploadResult.url,
      imagePublicId: uploadResult.publicId,
      author: req.user._id,
    });

    await newRecipe.save();

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      recipe: newRecipe,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
export const updateRecipe = async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    // Make sure user is the author
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this recipe' });
    }

    // Parse JSON arrays/objects from multipart form-data
    const ingredients = parseJsonField(req.body.ingredients, recipe.ingredients);
    const instructions = parseJsonField(req.body.instructions, recipe.instructions);
    const tags = parseJsonField(req.body.tags, recipe.tags);
    const nutritionalInfo = parseJsonField(req.body.nutritionalInfo, recipe.nutritionalInfo);

    const updateData = {
      title: req.body.title || recipe.title,
      description: req.body.description || recipe.description,
      prepTime: req.body.prepTime ? Number(req.body.prepTime) : recipe.prepTime,
      cookTime: req.body.cookTime ? Number(req.body.cookTime) : recipe.cookTime,
      servings: req.body.servings ? Number(req.body.servings) : recipe.servings,
      difficulty: req.body.difficulty || recipe.difficulty,
      ingredients,
      instructions,
      tags,
      nutritionalInfo,
    };

    // If new image file is uploaded, stream it to Cloudinary and delete the old one
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinaryStream(req.file.buffer, 'recipebox/recipes', req.body.title || recipe.title);
        updateData.imageUrl = uploadResult.url;
        updateData.imagePublicId = uploadResult.publicId;

        // Delete old image from Cloudinary (ignore demo images)
        if (recipe.imagePublicId && !recipe.imagePublicId.startsWith('recipebox/seed/')) {
          await cloudinary.uploader.destroy(recipe.imagePublicId);
        }
      } catch (uploadError) {
        return res.status(500).json({ success: false, message: `Image upload failed: ${uploadError.message}` });
      }
    }

    // We fetch and update the document, saving it so that pre-save hooks (totalTime and averageRating calculations) fire
    Object.assign(recipe, updateData);
    await recipe.save();

    res.json({
      success: true,
      message: 'Recipe updated successfully',
      recipe,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    // Make sure user is the author
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this recipe' });
    }

    // Delete image from Cloudinary (ignore demo seeds)
    if (recipe.imagePublicId && !recipe.imagePublicId.startsWith('recipebox/seed/')) {
      await cloudinary.uploader.destroy(recipe.imagePublicId);
    }

    await Recipe.deleteOne({ _id: recipe._id });

    res.json({ success: true, message: 'Recipe removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit or update a star rating review
// @route   POST /api/recipes/:id/reviews
// @access  Private
export const addRecipeReview = async (req, res) => {
  try {
    const { score, comment } = req.body;
    
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ success: false, message: 'Please provide a score between 1 and 5' });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    // Check if user already submitted a review
    const alreadyReviewedIdx = recipe.ratings.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewedIdx > -1) {
      // Update existing review
      recipe.ratings[alreadyReviewedIdx].score = Number(score);
      recipe.ratings[alreadyReviewedIdx].comment = comment || '';
      recipe.ratings[alreadyReviewedIdx].createdAt = new Date();
    } else {
      // Add new review
      recipe.ratings.push({
        user: req.user._id,
        score: Number(score),
        comment: comment || '',
      });
    }

    // Save will trigger our schema pre-save middleware to recalculate averageRating automatically
    await recipe.save();

    res.status(alreadyReviewedIdx > -1 ? 200 : 201).json({
      success: true,
      message: alreadyReviewedIdx > -1 ? 'Review updated' : 'Review added',
      averageRating: recipe.averageRating,
      ratingsCount: recipe.ratings.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

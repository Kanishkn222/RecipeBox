import Cookbook from '../models/Cookbook.js';
import Recipe from '../models/Recipe.js';

// @desc    Create a new cookbook collection
// @route   POST /api/cookbooks
// @access  Private
export const createCookbook = async (req, res) => {
  try {
    const { title, description, recipes } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide a cookbook title' });
    }

    // Check if user already has a cookbook with this name
    const titleExists = await Cookbook.findOne({ owner: req.user._id, title });
    if (titleExists) {
      return res.status(400).json({
        success: false,
        message: 'You already have a cookbook with this title. Please choose another name.',
      });
    }

    const cookbook = await Cookbook.create({
      title,
      description: description || '',
      owner: req.user._id,
      recipes: recipes || [],
    });

    res.status(201).json({
      success: true,
      message: 'Cookbook created successfully',
      cookbook,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all cookbooks owned by the logged-in user
// @route   GET /api/cookbooks
// @access  Private
export const getCookbooks = async (req, res) => {
  try {
    const cookbooks = await Cookbook.find({ owner: req.user._id })
      .populate('recipes', 'title imageUrl difficulty prepTime cookTime averageRating')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: cookbooks.length,
      cookbooks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single cookbook by ID
// @route   GET /api/cookbooks/:id
// @access  Private
export const getCookbookById = async (req, res) => {
  try {
    const cookbook = await Cookbook.findById(req.params.id)
      .populate({
        path: 'recipes',
        populate: { path: 'author', select: 'username profilePicture' }
      })
      .populate('owner', 'username profilePicture');

    if (!cookbook) {
      return res.status(404).json({ success: false, message: 'Cookbook not found' });
    }

    // Make sure user owns the cookbook
    if (cookbook.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this cookbook' });
    }

    res.json({ success: true, cookbook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a recipe to a cookbook
// @route   POST /api/cookbooks/:id/recipes
// @access  Private
export const addRecipeToCookbook = async (req, res) => {
  try {
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({ success: false, message: 'Please provide a recipe ID' });
    }

    // Verify recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const cookbook = await Cookbook.findById(req.params.id);
    if (!cookbook) {
      return res.status(404).json({ success: false, message: 'Cookbook not found' });
    }

    // Verify ownership
    if (cookbook.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this cookbook' });
    }

    // Add to set atomically to prevent duplicates
    const updatedCookbook = await Cookbook.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { recipes: recipeId } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Recipe added to cookbook successfully',
      recipesCount: updatedCookbook.recipes.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove a recipe from a cookbook
// @route   DELETE /api/cookbooks/:id/recipes/:recipeId
// @access  Private
export const removeRecipeFromCookbook = async (req, res) => {
  try {
    const { id, recipeId } = req.params;

    const cookbook = await Cookbook.findById(id);
    if (!cookbook) {
      return res.status(404).json({ success: false, message: 'Cookbook not found' });
    }

    // Verify ownership
    if (cookbook.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this cookbook' });
    }

    // Pull atomically
    const updatedCookbook = await Cookbook.findByIdAndUpdate(
      id,
      { $pull: { recipes: recipeId } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Recipe removed from cookbook successfully',
      recipesCount: updatedCookbook.recipes.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a cookbook
// @route   DELETE /api/cookbooks/:id
// @access  Private
export const deleteCookbook = async (req, res) => {
  try {
    const cookbook = await Cookbook.findById(req.params.id);

    if (!cookbook) {
      return res.status(404).json({ success: false, message: 'Cookbook not found' });
    }

    // Verify ownership
    if (cookbook.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this cookbook' });
    }

    await Cookbook.deleteOne({ _id: cookbook._id });

    res.json({ success: true, message: 'Cookbook removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

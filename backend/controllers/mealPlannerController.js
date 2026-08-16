import MealPlanner from '../models/MealPlanner.js';
import Recipe from '../models/Recipe.js';

// @desc    Schedule a recipe for a meal slot
// @route   POST /api/meals
// @access  Private
export const scheduleMeal = async (req, res) => {
  try {
    const { date, mealType, recipeId } = req.body;

    if (!date || !mealType || !recipeId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields: date, mealType, and recipeId',
      });
    }

    // Verify recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    // Attempt to create the scheduled meal plan
    // Schema pre-save hook will automatically strip hours/time components for YYYY-MM-DD alignment
    const newMeal = new MealPlanner({
      user: req.user._id,
      date: new Date(date),
      mealType,
      recipe: recipeId,
    });

    await newMeal.save();

    // Populate recipe details for visual validation in the response
    const populatedMeal = await MealPlanner.findById(newMeal._id)
      .populate('recipe', 'title imageUrl difficulty totalTime');

    res.status(201).json({
      success: true,
      message: 'Meal scheduled successfully',
      meal: populatedMeal,
    });
  } catch (error) {
    // Check for MongoDB composite unique index duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already planned a recipe for this meal slot on this date.',
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user scheduled meals (with optional date range filter)
// @route   GET /api/meals
// @access  Private
export const getMealPlans = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { user: req.user._id };

    // Apply date range filters if they exist
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0); // Start of day YYYY-MM-DD
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999); // End of day YYYY-MM-DD
        query.date.$lte = end;
      }
    }

    const meals = await MealPlanner.find(query)
      .populate('recipe', 'title imageUrl difficulty prepTime cookTime totalTime averageRating')
      .sort({ date: 1, mealType: 1 }); // Sort chronologically, then by meal type

    res.json({
      success: true,
      count: meals.length,
      meals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a scheduled meal from calendar
// @route   DELETE /api/meals/:id
// @access  Private
export const deleteMealPlan = async (req, res) => {
  try {
    const meal = await MealPlanner.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ success: false, message: 'Scheduled meal not found' });
    }

    // Verify ownership
    if (meal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this meal plan' });
    }

    await MealPlanner.deleteOne({ _id: meal._id });

    res.json({ success: true, message: 'Meal plan removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

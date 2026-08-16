import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    trim: true,
  },
});

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Recipe description is required'],
      trim: true,
    },
    prepTime: {
      type: Number,
      required: [true, 'Preparation time is required'],
      min: [0, 'Preparation time cannot be negative'],
    },
    cookTime: {
      type: Number,
      default: 0,
      min: [0, 'Cooking time cannot be negative'],
    },
    totalTime: {
      type: Number,
      default: function() {
        return (this.prepTime || 0) + (this.cookTime || 0);
      },
      index: true,
    },
    servings: {
      type: Number,
      default: 1,
      min: [1, 'Servings must be at least 1'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: '{VALUE} is not a valid difficulty level',
      },
    },
    ingredients: {
      type: [ingredientSchema],
      default: [],
    },
    instructions: {
      type: [String],
      default: [],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    nutritionalInfo: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbohydrates: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    },
    imageUrl: {
      type: String,
      required: [true, 'Recipe image URL is required'],
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    ratings: [ratingSchema],
    averageRating: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance querying:
// 1. Text index for search (title and description)
recipeSchema.index(
  { title: 'text', description: 'text' },
  { weights: { title: 10, description: 5 }, name: 'RecipeTextSearchIndex' }
);

// 2. Multikey index on tags for fast tags filters
recipeSchema.index({ tags: 1 });

// 3. Multikey index on ingredients for inclusive/exclusive filtering
recipeSchema.index({ 'ingredients.name': 1 });

// 4. Index on difficulty & averageRating for listing lists/rankings
recipeSchema.index({ difficulty: 1, averageRating: -1 });

// Pre-save hook to calculate totalTime and averageRating
recipeSchema.pre('save', function (next) {
  // Update totalTime
  this.totalTime = this.prepTime + this.cookTime;

  // Update averageRating
  if (this.ratings && this.ratings.length > 0) {
    const totalScore = this.ratings.reduce((sum, rating) => sum + rating.score, 0);
    this.averageRating = Math.round((totalScore / this.ratings.length) * 10) / 10;
  } else {
    this.averageRating = 0;
  }

  next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;

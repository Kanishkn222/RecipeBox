import mongoose from 'mongoose';

const mealPlannerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required for meal planning'],
    },
    mealType: {
      type: String,
      required: [true, 'Meal type is required'],
      enum: {
        values: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
        message: '{VALUE} is not a valid meal type',
      },
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// Compound unique index prevents the same user from planning multiple recipes for the same mealType on the same day.
// It also facilitates rapid retrieval of a user's calendar plan.
mealPlannerSchema.index({ user: 1, date: 1, mealType: 1 }, { unique: true });

// Pre-save hook to normalize the date field to midnight UTC (remove time components)
mealPlannerSchema.pre('save', function (next) {
  if (this.date) {
    const d = new Date(this.date);
    d.setUTCHours(0, 0, 0, 0);
    this.date = d;
  }
  next();
});

const MealPlanner = mongoose.model('MealPlanner', mealPlannerSchema);
export default MealPlanner;

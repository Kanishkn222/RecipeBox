import mongoose from 'mongoose';

const cookbookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Cookbook title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
// Compound index to search owner's cookbooks efficiently and enforce unique cookbook titles per user.
cookbookSchema.index({ owner: 1, title: 1 }, { unique: true });

const Cookbook = mongoose.model('Cookbook', cookbookSchema);
export default Cookbook;

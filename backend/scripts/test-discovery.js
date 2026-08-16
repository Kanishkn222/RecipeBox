import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Recipe from '../models/Recipe.js';

// Resolve directory name and load env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const runAggregationTest = async (title, matchQuery) => {
  console.log(`\n==================================================`);
  console.log(`🧪 TEST SCENARIO: ${title}`);
  console.log(`Query parameters:`, JSON.stringify(matchQuery, null, 2));
  console.log(`==================================================`);

  const matchStage = {};

  if (matchQuery.search) {
    matchStage.$text = { $search: matchQuery.search };
  }
  if (matchQuery.difficulty) {
    matchStage.difficulty = matchQuery.difficulty;
  }
  if (matchQuery.maxTime) {
    matchStage.totalTime = { $lte: Number(matchQuery.maxTime) };
  }
  if (matchQuery.tags) {
    matchStage.tags = { $all: matchQuery.tags.map(t => new RegExp(`^${t}$`, 'i')) };
  }
  if (matchQuery.ingredients) {
    matchStage['ingredients.name'] = { $all: matchQuery.ingredients.map(i => new RegExp(i, 'i')) };
  }
  if (matchQuery.excludeIngredients) {
    const excRegex = matchQuery.excludeIngredients.map(i => new RegExp(i, 'i'));
    if (matchStage['ingredients.name']) {
      matchStage['ingredients.name'].$nin = excRegex;
    } else {
      matchStage['ingredients.name'] = { $nin: excRegex };
    }
  }

  try {
    const pipeline = [{ $match: matchStage }];
    
    // Sort by textScore if text search is used, else chronological
    if (matchQuery.search) {
      pipeline.push({
        $project: {
          title: 1,
          difficulty: 1,
          totalTime: 1,
          tags: 1,
          ingredients: 1,
          averageRating: 1,
          score: { $meta: 'textScore' }
        }
      });
      pipeline.push({ $sort: { score: { $meta: 'textScore' } } });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    const results = await Recipe.aggregate(pipeline);
    console.log(`✅ Result: Found ${results.length} matching recipes.`);
    
    results.forEach((recipe, index) => {
      const ingList = recipe.ingredients.map(i => i.name).join(', ');
      console.log(`   ${index + 1}. [${recipe.difficulty}] ${recipe.title} (${recipe.totalTime} mins) - Rating: ${recipe.averageRating}`);
      console.log(`      Tags: ${JSON.stringify(recipe.tags)}`);
      console.log(`      Ingredients: ${ingList}`);
      if (recipe.score) {
        console.log(`      Search Score: ${recipe.score}`);
      }
    });

  } catch (error) {
    console.error(`❌ Scenario failed with error:`, error);
  }
};

const runAllTests = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recipebox');
    console.log('Connected to MongoDB. Starting aggregation query tests...');

    // Scenario 1: Text search for "Pizza"
    await runAggregationTest('Text search for "Pizza"', {
      search: 'Pizza'
    });

    // Scenario 2: Tag-based match (contains 'Italian' and 'Vegetarian')
    await runAggregationTest('Tag filtering (Italian & Vegetarian)', {
      tags: ['Italian', 'Vegetarian']
    });

    // Scenario 3: Time limitation (totalTime <= 30 mins)
    await runAggregationTest('Time restriction (totalTime <= 30 mins)', {
      maxTime: 30
    });

    // Scenario 4: Inclusive Ingredients (must contain 'basil')
    await runAggregationTest('Inclusive Ingredient ("basil")', {
      ingredients: ['basil']
    });

    // Scenario 5: Exclusive Ingredients (must NOT contain 'onion')
    await runAggregationTest('Exclusive Ingredient (exclude "onion")', {
      excludeIngredients: ['onion']
    });

    // Scenario 6: Combined Multi-condition Test
    // Search "pancakes", totalTime <= 45 mins
    await runAggregationTest('Combined Filter (Search: "pancakes", time <= 45 mins)', {
      search: 'pancakes',
      maxTime: 45
    });

    console.log('\nAll verification tests completed! 🚀');
    process.exit(0);
  } catch (error) {
    console.error('Test run failed:', error);
    process.exit(1);
  }
};

runAllTests();

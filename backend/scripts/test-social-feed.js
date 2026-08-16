import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

// Resolve directory name and load env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const runSocialTests = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recipebox');
    console.log('Connected to MongoDB for Social Graph & Feed testing...');

    // Fetch test users
    const alice = await User.findOne({ username: 'alice_cooks' });
    const bob = await User.findOne({ username: 'bob_bakes' });

    if (!alice || !bob) {
      console.error('❌ Failed to find test users. Please seed first.');
      process.exit(1);
    }

    console.log(`\n==================================================`);
    console.log(`🧪 SOCIAL GRAPH TEST: Unfollow & Follow Verification`);
    console.log(`==================================================`);

    console.log(`Initial State:`);
    console.log(`- Alice's following count: ${alice.following.length}`);
    console.log(`- Bob's followers count: ${bob.followers.length}`);
    
    // Alice unfollows Bob
    console.log('\nStep 1: Alice unfollows Bob...');
    await User.findByIdAndUpdate(alice._id, { $pull: { following: bob._id } });
    await User.findByIdAndUpdate(bob._id, { $pull: { followers: alice._id } });

    let aliceUpdated = await User.findById(alice._id);
    let bobUpdated = await User.findById(bob._id);
    
    console.log(`Updated State:`);
    console.log(`- Alice follows Bob? ${aliceUpdated.following.includes(bob._id) ? 'YES' : 'NO'}`);
    console.log(`- Bob followed by Alice? ${bobUpdated.followers.includes(alice._id) ? 'YES' : 'NO'}`);

    if (!aliceUpdated.following.includes(bob._id) && !bobUpdated.followers.includes(alice._id)) {
      console.log('✅ Unfollow atomic pull successful!');
    } else {
      console.log('❌ Unfollow failed.');
    }

    // Alice follows Bob back
    console.log('\nStep 2: Alice follows Bob back...');
    await User.findByIdAndUpdate(alice._id, { $addToSet: { following: bob._id } });
    await User.findByIdAndUpdate(bob._id, { $addToSet: { followers: alice._id } });

    aliceUpdated = await User.findById(alice._id);
    bobUpdated = await User.findById(bob._id);

    console.log(`Updated State:`);
    console.log(`- Alice follows Bob? ${aliceUpdated.following.includes(bob._id) ? 'YES' : 'NO'}`);
    console.log(`- Bob followed by Alice? ${bobUpdated.followers.includes(alice._id) ? 'YES' : 'NO'}`);

    if (aliceUpdated.following.includes(bob._id) && bobUpdated.followers.includes(alice._id)) {
      console.log('✅ Follow atomic addToSet successful!');
    } else {
      console.log('❌ Follow failed.');
    }

    console.log(`\n==================================================`);
    console.log(`🧪 ACTIVITY FEED TEST: Chronological Query Verification`);
    console.log(`==================================================`);

    // Fetch Alice's feed (Alice follows Bob and Charlie)
    console.log(`Alice is following:`, aliceUpdated.following);

    const feedRecipes = await Recipe.find({ author: { $in: aliceUpdated.following } })
      .sort({ createdAt: -1 })
      .populate('author', 'username');

    console.log(`✅ Result: Found ${feedRecipes.length} recipes in Alice's activity feed.`);

    // Output feed recipes and check sorting
    let isSorted = true;
    let lastDate = new Date();

    feedRecipes.forEach((recipe, index) => {
      const createdTime = new Date(recipe.createdAt);
      if (createdTime > lastDate) {
        isSorted = false;
      }
      lastDate = createdTime;

      console.log(
        `   ${index + 1}. [${recipe.createdAt.toISOString()}] by @${recipe.author.username} - ${recipe.title}`
      );
    });

    if (isSorted) {
      console.log('\n✅ Feed is correctly sorted in descending chronological order (newest first)!');
    } else {
      console.log('\n❌ Feed chronological sorting error!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Test run failed:', error);
    process.exit(1);
  }
};

runSocialTests();

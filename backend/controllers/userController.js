import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    // Prevent following oneself
    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Perform atomic follow operations
    // 1. Add targetUser to currentUser's "following" list
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId },
    });

    // 2. Add currentUser to targetUser's "followers" list
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId },
    });

    res.json({
      success: true,
      message: `Successfully followed user ${targetUser.username}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unfollow a user
// @route   POST /api/users/:id/unfollow
// @access  Private
export const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Perform atomic unfollow operations
    // 1. Pull targetUser from currentUser's "following" list
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId },
    });

    // 2. Pull currentUser from targetUser's "followers" list
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId },
    });

    res.json({
      success: true,
      message: `Successfully unfollowed user ${targetUser.username}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile by username
// @route   GET /api/users/profile/:username
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers', 'username profilePicture bio')
      .populate('following', 'username profilePicture bio');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get count of recipes authored by this user
    const recipeCount = await Recipe.countDocuments({ author: user._id });

    res.json({
      success: true,
      profile: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        followers: user.followers,
        following: user.following,
        recipeCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get chronological feed of recipes from followed users
// @route   GET /api/feed
// @access  Private
export const getActivityFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skipNum = (pageNum - 1) * limitNum;

    // Get the list of IDs the user is following
    const followingIds = req.user.following;

    if (!followingIds || followingIds.length === 0) {
      return res.json({
        success: true,
        count: 0,
        total: 0,
        totalPages: 0,
        currentPage: pageNum,
        recipes: [],
      });
    }

    // Retrieve recipes from these authors, sorted chronologically (newest first)
    const total = await Recipe.countDocuments({ author: { $in: followingIds } });
    
    const recipes = await Recipe.find({ author: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum)
      .populate('author', 'username profilePicture bio');

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

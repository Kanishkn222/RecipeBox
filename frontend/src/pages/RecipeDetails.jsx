import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Users, ChevronRight, UserPlus, UserMinus, CheckSquare, Square, MessageSquare, Loader2, Sparkles, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { handleImageError, getFallbackImage } from '../utils/imageHelper';

const RecipeDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Follow/Unfollow status
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Review Form State
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  // Checklist state for ingredients
  const [checkedIngredients, setCheckedIngredients] = useState({});

  // Fetch recipe details
  const fetchRecipe = useCallback(async () => {
    try {
      const response = await api.get(`/recipes/${id}`);
      if (response.data.success) {
        const data = response.data.recipe;
        setRecipe(data);

        // Check if current user is following the author
        if (isAuthenticated && user && data.author) {
          const profileResponse = await api.get(`/users/profile/${data.author.username}`);
          if (profileResponse.data.success) {
            const isFollower = profileResponse.data.profile.followers.some(
              (f) => f._id.toString() === user._id.toString()
            );
            setIsFollowing(isFollower);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, user]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  // Toggle follow/unfollow author
  const handleFollowToggle = async () => {
    if (!isAuthenticated) return;
    setFollowLoading(true);
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const response = await api.post(`/users/${recipe.author._id}/${endpoint}`);
      if (response.data.success) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  // Toggle checkbox on ingredient list
  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Submit review handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewMessage('');
    try {
      const response = await api.post(`/recipes/${id}/reviews`, { score, comment });
      if (response.data.success) {
        setReviewMessage('Thank you! Review saved.');
        setComment('');
        // Reload recipe details to update averageRating and reviews list
        fetchRecipe();
      }
    } catch (error) {
      setReviewMessage(error.response?.data?.message || 'Error saving review');
    } finally {
      setReviewLoading(false);
    }
  };

  // Difficulty CSS Badge helper
  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Medium: 'bg-amber-50 text-amber-700 border-amber-100',
    Hard: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-2" />
        <p className="text-sm font-semibold">Reading directions...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Recipe Not Found</h3>
        <Link to="/explore" className="text-sm text-brand-500 hover:underline">
          Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Visual Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

        {/* Cover Photo */}
        <div className="h-96 rounded-3xl border border-slate-100 overflow-hidden bg-slate-50 shadow-premium">
          <img
            src={recipe.imageUrl || getFallbackImage(recipe.title)}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, recipe.title)}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Recipe info overview panel */}
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${difficultyColors[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
            {recipe.tags?.map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-xs font-semibold bg-brand-50 text-brand-600 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight mb-4">
            {recipe.title}
          </h1>

          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            {recipe.description}
          </p>

          {/* Author info & Follow/Unfollow trigger */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm mb-6">
            <div className="flex items-center gap-3">
              <img
                src={recipe.author?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/d_avatar.png/v1/avatar.png'}
                alt={recipe.author?.username}
                className="w-10 h-10 rounded-full border object-cover"
              />
              <div>
                <p className="text-xs text-slate-400 font-medium">Published by</p>
                <p className="text-sm font-semibold text-slate-800 leading-tight">@{recipe.author?.username}</p>
              </div>
            </div>

            {/* Follow/Unfollow widget */}
            {isAuthenticated && user && recipe.author && recipe.author._id.toString() !== user._id.toString() && (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-premium ${isFollowing
                  ? 'bg-slate-50 text-slate-600 border-slate-200 hover:text-red-500 hover:bg-red-50 hover:border-red-100'
                  : 'bg-brand-500 text-white border-transparent hover:bg-brand-600 shadow-md shadow-brand-200'
                  }`}
              >
                {followLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isFollowing ? (
                  <>
                    <UserMinus className="w-3.5 h-3.5" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    Follow
                  </>
                )}
              </button>
            )}
          </div>

          {/* Nutritional metrics grid */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-brand-50/50 rounded-2xl border border-brand-100">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prep</p>
              <p className="text-base font-bold font-display text-slate-800">{recipe.prepTime}m</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cook</p>
              <p className="text-base font-bold font-display text-slate-800">{recipe.cookTime}m</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Servings</p>
              <p className="text-base font-bold font-display text-slate-800">{recipe.servings}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating</p>
              <p className="text-base font-bold font-display text-slate-800 flex items-center justify-center gap-0.5">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                {recipe.averageRating > 0 ? recipe.averageRating : '—'}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Ingredients & Instructions section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">

        {/* Ingredients Checklist column */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-premium">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-brand-500" />
            Ingredients
          </h2>
          <p className="text-slate-400 text-xs mb-4">Check off items as you prepare your workspace.</p>
          <div className="space-y-3.5">
            {recipe.ingredients?.map((ing, idx) => {
              const checked = checkedIngredients[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleIngredient(idx)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-premium cursor-pointer ${checked
                    ? 'border-emerald-200 bg-emerald-50/50 text-slate-400 line-through'
                    : 'border-slate-100 hover:border-brand-200 bg-white text-slate-700'
                    }`}
                >
                  {checked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-350 shrink-0" />
                  )}
                  <span className="text-sm font-medium">
                    {ing.quantity} {ing.unit} <span className="font-semibold text-slate-800">{ing.name}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Directions steps list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500 fill-brand-50" />
              Step-by-Step Directions
            </h2>
            <div className="space-y-6">
              {recipe.instructions?.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 font-bold font-display flex items-center justify-center shrink-0 shadow-sm border border-brand-100">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Reviews and feedback section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-500" />
          Review Center ({recipe.ratings?.length || 0})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Review submission Form (Left) */}
          <div className="lg:col-span-1 border-r border-slate-100 lg:pr-8">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Submit Feedback</h3>

            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">

                {/* Clickable Star select */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Score
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setScore(star)}
                        className="p-1 hover:scale-110 transition-premium"
                      >
                        <Star
                          className={`w-6 h-6 ${star <= score
                            ? 'fill-amber-400 stroke-amber-400'
                            : 'text-slate-300'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Your Review
                  </label>
                  <textarea
                    rows="3"
                    placeholder="How did it taste? Did you make any substitutions?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-brand-500 rounded-xl text-sm transition-premium outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white rounded-xl text-xs font-semibold transition-premium shadow-md shadow-brand-200 active:scale-95"
                >
                  {reviewLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    'Submit Review'
                  )}
                </button>

                {reviewMessage && (
                  <p className="text-xs font-semibold text-center text-brand-500 mt-2">
                    {reviewMessage}
                  </p>
                )}

              </form>
            ) : (
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-slate-500 text-xs mb-3">You must be logged in to leave reviews.</p>
                <Link
                  to="/login"
                  className="inline-block px-4 py-2 bg-slate-900 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl transition-premium shadow-sm"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>

          {/* Reviews list (Right) */}
          <div className="lg:col-span-2 space-y-5 max-h-96 overflow-y-auto pr-2">
            {recipe.ratings && recipe.ratings.length > 0 ? (
              recipe.ratings.map((rev) => (
                <div key={rev._id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/d_avatar.png/v1/avatar.png'}
                        alt={rev.user?.username}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-semibold text-slate-800">
                        @{rev.user?.username || 'user'}
                      </span>
                    </div>
                    {/* Stars count */}
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.score
                            ? 'fill-amber-400 stroke-amber-400'
                            : 'text-slate-200'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-8">
                    {rev.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">
                <p className="text-xs font-semibold">No reviews yet. Be the first to try it!</p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default RecipeDetails;

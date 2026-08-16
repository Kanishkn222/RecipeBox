import React, { useState, useEffect } from 'react';
import { Rss, UserCheck, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';

const Feed = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const response = await api.get('/feed');
      if (response.data.success) {
        setRecipes(response.data.recipes);
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight flex items-center gap-2">
          <Rss className="w-7 h-7 text-brand-500 fill-brand-50" />
          Your Feed
        </h1>
        <p className="text-slate-500 mt-1">Updates and recipes posted by the home chefs you follow.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-2" />
          <p className="text-sm font-semibold">Stirring the pot...</p>
        </div>
      ) : recipes.length === 0 ? (
        // Empty feed visual state
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-premium max-w-xl mx-auto p-8">
          <div className="inline-flex p-4 bg-brand-50 text-brand-500 rounded-3xl mb-6">
            <UserCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Your Feed is Quiet</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
            You aren't following anyone yet, or the chefs you follow haven't posted any recipes. Follow other home chefs to build your feed!
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-premium shadow-md shadow-brand-200 active:scale-95"
          >
            Discover Chefs and Recipes
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        // Feed Grid list
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} onCookbookAdded={fetchFeed} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;

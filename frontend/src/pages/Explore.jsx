import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, Plus, X, RotateCcw, ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';

const Explore = () => {
  // Query Filters State
  const [search, setSearch] = useState('');
  const [maxTime, setMaxTime] = useState(120); // Default max totalTime
  const [difficulty, setDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [incIngredients, setIncIngredients] = useState([]);
  const [excIngredients, setExcIngredients] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);

  // Inputs state
  const [incInput, setIncInput] = useState('');
  const [excInput, setExcInput] = useState('');

  // Results State
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Standard predefined tags list for buttons
  const availableTags = ['Italian', 'Baking', 'Healthy', 'Vegan', 'Vegetarian', 'Spicy', 'Dessert', 'Chicken', 'Quick', 'Soup'];

  // Fetch recipes handler
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 8,
      };

      if (search) params.search = search;
      if (maxTime && maxTime < 120) params.maxTime = maxTime;
      if (difficulty) params.difficulty = difficulty;
      if (sortBy) params.sortBy = sortBy;
      if (selectedTags.length > 0) params.tags = selectedTags.join(',');
      if (incIngredients.length > 0) params.ingredients = incIngredients.join(',');
      if (excIngredients.length > 0) params.excludeIngredients = excIngredients.join(',');

      const response = await api.get('/recipes', { params });
      if (response.data.success) {
        setRecipes(response.data.recipes);
        setTotalRecipes(response.data.total);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, maxTime, difficulty, selectedTags, incIngredients, excIngredients, sortBy]);

  // Fetch recipes when query states change
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setMaxTime(120);
    setDifficulty('');
    setSelectedTags([]);
    setIncIngredients([]);
    setExcIngredients([]);
    setSortBy('');
    setPage(1);
  };

  // Add tag toggler
  const handleToggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setPage(1);
  };

  // Add inclusive ingredient pill
  const handleAddIncIngredient = (e) => {
    e.preventDefault();
    const val = incInput.trim().toLowerCase();
    if (val && !incIngredients.includes(val)) {
      setIncIngredients(prev => [...prev, val]);
      setIncInput('');
      setPage(1);
    }
  };

  // Remove inclusive ingredient pill
  const handleRemoveIncIngredient = (ing) => {
    setIncIngredients(prev => prev.filter(i => i !== ing));
    setPage(1);
  };

  // Add exclusive ingredient pill
  const handleAddExcIngredient = (e) => {
    e.preventDefault();
    const val = excInput.trim().toLowerCase();
    if (val && !excIngredients.includes(val)) {
      setExcIngredients(prev => [...prev, val]);
      setExcInput('');
      setPage(1);
    }
  };

  // Remove exclusive ingredient pill
  const handleRemoveExcIngredient = (ing) => {
    setExcIngredients(prev => prev.filter(i => i !== ing));
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Visual Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-brand-500 fill-brand-100" />
            Discover Recipes
          </h1>
          <p className="text-slate-500 mt-1">Explore culinary creations with advanced ingredient and cooking time filters.</p>
        </div>

        {/* Quick Sorters */}
        <div className="flex items-center gap-2 select-none self-start md:self-auto">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-brand-500 transition-premium shadow-sm cursor-pointer"
          >
            <option value="">Newest Recipes</option>
            <option value="rating">Highest Rated</option>
            <option value="time">Quickest Cook</option>
          </select>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar filters */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-premium self-start space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-display font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-500" />
              Filters
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-slate-400 hover:text-brand-500 flex items-center gap-1 transition-premium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Search text query */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Search Keywords
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Pizza, Salmon, Chicken..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-brand-500 transition-premium outline-none"
              />
            </div>
          </div>

          {/* Time Limit slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Max Cooking Time</span>
              <span className="text-brand-500 font-semibold font-display tracking-normal">
                {maxTime >= 120 ? 'Any Time' : `${maxTime} mins`}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={maxTime}
              onChange={(e) => { setMaxTime(Number(e.target.value)); setPage(1); }}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          {/* Difficulty selection checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Difficulty
            </label>
            <div className="flex gap-2">
              {['Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => { setDifficulty(prev => prev === diff ? '' : diff); setPage(1); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-premium ${
                    difficulty === diff
                      ? 'border-brand-500 bg-brand-50 text-brand-500 shadow-sm'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Inclusive Ingredients input */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Must Contain Ingredients
            </label>
            <form onSubmit={handleAddIncIngredient} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. basil, garlic"
                value={incInput}
                onChange={(e) => setIncInput(e.target.value)}
                className="flex-grow px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-brand-500 outline-none transition-premium"
              />
              <button
                type="submit"
                className="p-2.5 bg-slate-900 hover:bg-brand-500 text-white rounded-xl transition-premium flex items-center justify-center active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
            {/* Inclusive pills */}
            <div className="flex flex-wrap gap-1.5">
              {incIngredients.map((ing) => (
                <span
                  key={ing}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full"
                >
                  {ing}
                  <button onClick={() => handleRemoveIncIngredient(ing)} className="hover:text-emerald-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Exclusive Ingredients input */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Must NOT Contain
            </label>
            <form onSubmit={handleAddExcIngredient} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. gluten, peanuts"
                value={excInput}
                onChange={(e) => setExcInput(e.target.value)}
                className="flex-grow px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-brand-500 outline-none transition-premium"
              />
              <button
                type="submit"
                className="p-2.5 bg-slate-900 hover:bg-brand-500 text-white rounded-xl transition-premium flex items-center justify-center active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
            {/* Exclusive pills */}
            <div className="flex flex-wrap gap-1.5">
              {excIngredients.map((ing) => (
                <span
                  key={ing}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100 rounded-full"
                >
                  {ing}
                  <button onClick={() => handleRemoveExcIngredient(ing)} className="hover:text-rose-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags bubble selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const selected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-xl border transition-premium ${
                      selected
                        ? 'border-brand-500 bg-brand-500 text-white shadow-sm'
                        : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Recipes Grid list */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-2" />
              <p className="text-sm font-semibold">Tossing the pan...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-premium">
              <p className="text-slate-400 text-sm font-semibold mb-2">No matching recipes found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try loosening your filter constraints, searching for broader terms, or adjusting your excluded ingredients.
              </p>
            </div>
          ) : (
            <>
              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} onCookbookAdded={fetchRecipes} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-slate-500">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-premium active:scale-95 select-none"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <span className="text-xs font-semibold font-display">
                    Page {page} of {totalPages} <span className="text-slate-400 font-normal">({totalRecipes} total matches)</span>
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-premium active:scale-95 select-none"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Explore;

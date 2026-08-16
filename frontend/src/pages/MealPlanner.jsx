import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Trash2, X, Sparkles, Loader2, Search } from 'lucide-react';
import api from '../services/api';
import { handleImageError, getFallbackImage } from '../utils/imageHelper';

const MealPlanner = () => {
  // Calendar dates
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  
  // Planned meals state
  const [meals, setMeals] = useState({});
  const [loading, setLoading] = useState(true);

  // Modal selector state
  const [showModal, setShowModal] = useState(false);
  const [modalTarget, setModalTarget] = useState(null); // { date: Date, mealType: string }
  const [recipesList, setRecipesList] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate 7 days starting from currentWeekStart
  const generateWeek = useCallback(() => {
    const days = [];
    const temp = new Date(currentWeekStart);
    for (let i = 0; i < 7; i++) {
      const d = new Date(temp);
      d.setDate(temp.getDate() + i);
      d.setUTCHours(0, 0, 0, 0); // Normalized to UTC midnight
      days.push(d);
    }
    setWeekDays(days);
  }, [currentWeekStart]);

  useEffect(() => {
    generateWeek();
  }, [generateWeek]);

  // Fetch meal plans for the generated date range
  const fetchMealPlans = useCallback(async () => {
    if (weekDays.length === 0) return;
    setLoading(true);
    try {
      const startDate = weekDays[0].toISOString();
      const endDate = weekDays[6].toISOString();

      const response = await api.get('/meals', {
        params: { startDate, endDate }
      });

      if (response.data.success) {
        // Map list array to object grid by dateKey -> YYYY-MM-DD
        const mealGrid = {};
        response.data.meals.forEach((m) => {
          const dateKey = new Date(m.date).toISOString().split('T')[0];
          if (!mealGrid[dateKey]) {
            mealGrid[dateKey] = {};
          }
          mealGrid[dateKey][m.mealType] = m;
        });
        setMeals(mealGrid);
      }
    } catch (err) {
      console.error('Error fetching meal plans:', err);
    } finally {
      setLoading(false);
    }
  }, [weekDays]);

  useEffect(() => {
    fetchMealPlans();
  }, [fetchMealPlans]);

  // Fetch recipes list for modal selection
  const fetchRecipesForModal = async () => {
    setLoadingRecipes(true);
    try {
      const response = await api.get('/recipes', {
        params: { limit: 50, search: searchQuery }
      });
      if (response.data.success) {
        setRecipesList(response.data.recipes);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchRecipesForModal();
    }
  }, [showModal, searchQuery]);

  // Handle scheduling a recipe
  const handleScheduleRecipe = async (recipeId) => {
    if (!modalTarget) return;
    try {
      const response = await api.post('/meals', {
        date: modalTarget.date.toISOString(),
        mealType: modalTarget.mealType,
        recipeId
      });

      if (response.data.success) {
        setShowModal(false);
        setModalTarget(null);
        setSearchQuery('');
        fetchMealPlans();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error scheduling meal');
    }
  };

  // Handle removing a scheduled meal
  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm('Remove this recipe from your schedule?')) return;
    try {
      const response = await api.delete(`/meals/${mealId}`);
      if (response.data.success) {
        fetchMealPlans();
      }
    } catch (err) {
      console.error('Error removing meal:', err);
    }
  };

  // Navigate calendar weeks
  const navigateWeek = (direction) => {
    const nextStart = new Date(currentWeekStart);
    nextStart.setDate(currentWeekStart.getDate() + (direction * 7));
    setCurrentWeekStart(nextStart);
  };

  // Helper date text formatters
  const formatDateLabel = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header & Week Navigations */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-brand-500 fill-brand-50" />
            Weekly Meal Planner
          </h1>
          <p className="text-slate-500 mt-1">Plan your daily nutrition and organize your weekly cooking calendar.</p>
        </div>

        {/* Week navigation buttons */}
        <div className="flex items-center gap-2 select-none self-start sm:self-auto">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 border border-slate-200 hover:border-brand-500 rounded-xl bg-white transition-premium active:scale-95 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          
          <span className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-sm">
            {weekDays.length > 0 && `${formatDateLabel(weekDays[0])} — ${formatDateLabel(weekDays[6])}`}
          </span>

          <button
            onClick={() => navigateWeek(1)}
            className="p-2 border border-slate-200 hover:border-brand-500 rounded-xl bg-white transition-premium active:scale-95 shadow-sm"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {loading && weekDays.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      ) : (
        // Weekly Planner main calendar table grid
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-7 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            {weekDays.map((day) => {
              const dateKey = day.toISOString().split('T')[0];
              const isToday = new Date().toDateString() === day.toDateString();

              return (
                <div key={dateKey} className="flex flex-col min-h-[30rem]">
                  {/* Day header */}
                  <div className={`p-4 text-center border-b border-slate-100 ${isToday ? 'bg-brand-50/50' : 'bg-slate-50/50'}`}>
                    <p className={`text-xs font-extrabold uppercase tracking-wider ${isToday ? 'text-brand-500' : 'text-slate-400'}`}>
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>

                  {/* Meal slots */}
                  <div className="flex-grow p-3.5 space-y-4">
                    {mealTypes.map((mealType) => {
                      const mealPlan = meals[dateKey]?.[mealType];

                      return (
                        <div key={mealType} className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                            {mealType}
                          </p>

                          {mealPlan ? (
                            // Scheduled Meal Card
                            <div className="relative group p-2 bg-slate-50 hover:bg-brand-50/40 rounded-xl border border-slate-100 hover:border-brand-200 transition-premium flex gap-2">
                              <img
                                src={mealPlan.recipe.imageUrl || getFallbackImage(mealPlan.recipe.title)}
                                alt={mealPlan.recipe.title}
                                referrerPolicy="no-referrer"
                                onError={(e) => handleImageError(e, mealPlan.recipe.title)}
                                className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0"
                              />
                              <div className="min-w-0 pr-6">
                                <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                                  {mealPlan.recipe.title}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5 mt-0.5">
                                  <Clock className="w-2.5 h-2.5 text-brand-500" />
                                  {mealPlan.recipe.totalTime || mealPlan.recipe.prepTime + mealPlan.recipe.cookTime}m
                                </p>
                              </div>

                              {/* Floating Remove Button */}
                              <button
                                onClick={() => handleDeleteMeal(mealPlan._id)}
                                title="Remove meal"
                                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-white/80 transition-premium shadow-sm opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            // Empty Slot Schedule Button
                            <button
                              onClick={() => {
                                setModalTarget({ date: day, mealType });
                                setShowModal(true);
                              }}
                              className="w-full flex items-center justify-center gap-1.5 py-3 border border-dashed border-slate-250 hover:border-brand-400 bg-white hover:bg-brand-50/20 rounded-xl text-[10px] font-bold text-slate-400 hover:text-brand-500 transition-premium active:scale-[0.98]"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Plan Meal
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* Modal Dialog: Select recipe to schedule */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 overflow-hidden flex flex-col max-h-[80vh] animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Schedule {modalTarget?.mealType}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pick a recipe for {modalTarget && formatDateLabel(modalTarget.date)}
                </p>
              </div>
              <button
                onClick={() => { setShowModal(false); setModalTarget(null); setSearchQuery(''); }}
                className="p-1.5 hover:bg-slate-55 text-slate-400 hover:text-slate-700 rounded-lg transition-premium"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-brand-500 outline-none transition-premium"
              />
            </div>

            {/* Recipes lists wrapper */}
            <div className="flex-grow overflow-y-auto pr-1 space-y-2 select-none">
              {loadingRecipes ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
                </div>
              ) : recipesList.length === 0 ? (
                <p className="text-center py-10 text-xs text-slate-400 font-semibold">
                  No recipes found. Try another search.
                </p>
              ) : (
                recipesList.map((recipe) => (
                  <div
                    key={recipe._id}
                    onClick={() => handleScheduleRecipe(recipe._id)}
                    className="flex items-center gap-3 p-2 hover:bg-brand-50/50 rounded-2xl border border-transparent hover:border-brand-200 transition-premium cursor-pointer"
                  >
                    <img
                      src={recipe.imageUrl || getFallbackImage(recipe.title)}
                      alt={recipe.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, recipe.title)}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0 flex-grow">
                      <p className="text-xs font-bold text-slate-800 truncate">{recipe.title}</p>
                      <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5 mt-0.5">
                        <Clock className="w-2.5 h-2.5 text-brand-500" />
                        {recipe.totalTime} mins | By @{recipe.author?.username}
                      </p>
                    </div>
                    <Plus className="w-4 h-4 text-brand-500 pr-1 shrink-0" />
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MealPlanner;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, User, Bookmark, Plus, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { handleImageError, getFallbackImage } from '../utils/imageHelper';

const RecipeCard = ({ recipe, onCookbookAdded }) => {
  const { isAuthenticated } = useAuth();
  const [showCookbookDropdown, setShowCookbookDropdown] = useState(false);
  const [cookbooks, setCookbooks] = useState([]);
  const [loadingCookbooks, setLoadingCookbooks] = useState(false);
  const [addingStatus, setAddingStatus] = useState({}); // cookbookId -> status ('adding' | 'success')

  const fetchUserCookbooks = async () => {
    if (!isAuthenticated) return;
    setLoadingCookbooks(true);
    try {
      const response = await api.get('/cookbooks');
      if (response.data.success) {
        setCookbooks(response.data.cookbooks);
      }
    } catch (error) {
      console.error('Error fetching cookbooks:', error);
    } finally {
      setLoadingCookbooks(false);
    }
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCookbookDropdown(!showCookbookDropdown);
    if (!showCookbookDropdown) {
      fetchUserCookbooks();
    }
  };

  const addRecipeToCollection = async (e, cookbookId) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingStatus(prev => ({ ...prev, [cookbookId]: 'adding' }));
    try {
      const response = await api.post(`/cookbooks/${cookbookId}/recipes`, {
        recipeId: recipe._id
      });
      
      if (response.data.success) {
        setAddingStatus(prev => ({ ...prev, [cookbookId]: 'success' }));
        if (onCookbookAdded) onCookbookAdded();
        
        // Reset status after a brief delay
        setTimeout(() => {
          setAddingStatus(prev => ({ ...prev, [cookbookId]: null }));
        }, 2000);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding to cookbook');
      setAddingStatus(prev => ({ ...prev, [cookbookId]: null }));
    }
  };

  // Color mappings for difficulty levels
  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Medium: 'bg-amber-50 text-amber-700 border-amber-100',
    Hard: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden hover:-translate-y-1 transition-premium shadow-premium hover:shadow-premium-hover">
      {/* Recipe Image Card */}
      <Link to={`/recipes/${recipe._id}`} className="block relative h-48 overflow-hidden bg-slate-100">
        <img 
          src={recipe.imageUrl || recipe.image || getFallbackImage(recipe.title)} 
          alt={recipe.title} 
          referrerPolicy="no-referrer"
          onError={(e) => handleImageError(e, recipe.title)}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        
        {/* Difficulty Badge */}
        <span className={`absolute top-4 left-4 px-2.5 py-1 text-xs font-semibold rounded-full border ${difficultyColors[recipe.difficulty]}`}>
          {recipe.difficulty}
        </span>

        {/* Rating overlay badge */}
        {recipe.averageRating > 0 && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-white/95 text-slate-800 backdrop-blur-sm shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            {recipe.averageRating}
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="flex flex-col flex-grow p-5">
        {/* Title */}
        <Link to={`/recipes/${recipe._id}`} className="block mb-2">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-500 transition-premium line-clamp-1">
            {recipe.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
          {recipe.description}
        </p>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {recipe.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer info: time & author & quick save */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              {recipe.totalTime} mins
            </span>
            <span className="flex items-center gap-1.5">
              <img
                src={recipe.author?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/d_avatar.png/v1/avatar.png'}
                alt={recipe.author?.username}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="font-semibold text-slate-700">@{recipe.author?.username || 'chef'}</span>
            </span>
          </div>

          {/* Quick-add to Cookbook collection */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                title="Add to Cookbook"
                className={`p-2 rounded-xl border transition-premium hover:bg-brand-50 ${
                  showCookbookDropdown 
                    ? 'border-brand-500 bg-brand-50 text-brand-500' 
                    : 'border-slate-200 text-slate-400 hover:text-brand-500'
                }`}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              {/* Cookbooks selection dropdown */}
              {showCookbookDropdown && (
                <div className="absolute right-0 bottom-10 z-30 w-56 p-2 bg-white rounded-xl shadow-xl border border-slate-100 animate-fade-in">
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-2 py-1">
                    Add to collection
                  </p>
                  
                  {loadingCookbooks ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                    </div>
                  ) : cookbooks.length === 0 ? (
                    <div className="text-center p-3 text-slate-400">
                      <p className="mb-2">No cookbooks found</p>
                      <Link
                        to="/cookbooks"
                        className="text-xs font-semibold text-brand-500 hover:underline"
                      >
                        Create One
                      </Link>
                    </div>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {cookbooks.map((cb) => {
                        const status = addingStatus[cb._id];
                        const isAlreadyAdded = cb.recipes.some((r) => r._id === recipe._id);

                        return (
                          <button
                            key={cb._id}
                            disabled={isAlreadyAdded || status === 'adding'}
                            onClick={(e) => addRecipeToCollection(e, cb._id)}
                            className="w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-premium text-xs text-slate-700"
                          >
                            <span className="font-semibold truncate pr-2">{cb.title}</span>
                            {isAlreadyAdded ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : status === 'adding' ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-500 shrink-0" />
                            ) : status === 'success' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderHeart, Plus, Trash2, Library, X, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';


const Cookbooks = () => {
  const [cookbooks, setCookbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCookbook, setSelectedCookbook] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Cookbook creation form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all cookbooks
  const fetchCookbooks = async (selectFirst = false) => {
    try {
      const response = await api.get('/cookbooks');
      if (response.data.success) {
        setCookbooks(response.data.cookbooks);
        
        // Optionally select the first cookbook by default
        if (response.data.cookbooks.length > 0) {
          if (selectFirst || !selectedCookbook) {
            fetchCookbookDetails(response.data.cookbooks[0]._id);
          } else {
            // Refresh selected details
            fetchCookbookDetails(selectedCookbook._id);
          }
        } else {
          setSelectedCookbook(null);
        }
      }
    } catch (err) {
      console.error('Error fetching cookbooks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single cookbook details
  const fetchCookbookDetails = async (id) => {
    setLoadingDetails(true);
    try {
      const response = await api.get(`/cookbooks/${id}`);
      if (response.data.success) {
        setSelectedCookbook(response.data.cookbook);
      }
    } catch (err) {
      console.error('Error fetching cookbook details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchCookbooks(true);
  }, []);

  // Handle cookbook creation
  const handleCreateCookbook = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim()) {
      setError('Please provide a title');
      return;
    }

    setCreateLoading(true);
    try {
      const response = await api.post('/cookbooks', { title, description });
      if (response.data.success) {
        setTitle('');
        setDescription('');
        await fetchCookbooks(false);
        // Select the newly created cookbook
        await fetchCookbookDetails(response.data.cookbook._id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating cookbook');
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle cookbook deletion
  const handleDeleteCookbook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cookbook?')) return;
    try {
      const response = await api.delete(`/cookbooks/${id}`);
      if (response.data.success) {
        setSelectedCookbook(null);
        fetchCookbooks(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting cookbook');
    }
  };

  // Handle removing a recipe from a cookbook
  const handleRemoveRecipe = async (recipeId) => {
    if (!selectedCookbook) return;
    try {
      const response = await api.delete(`/cookbooks/${selectedCookbook._id}/recipes/${recipeId}`);
      if (response.data.success) {
        fetchCookbooks(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing recipe');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight flex items-center gap-2">
          <FolderHeart className="w-7 h-7 text-brand-500 fill-brand-50" />
          My Cookbooks
        </h1>
        <p className="text-slate-500 mt-1">Organize and save your favorite recipes in custom collections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Create form & collection list */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Create Cookbook Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-premium">
            <h3 className="font-display font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              <Plus className="w-4.5 h-4.5 text-brand-500" />
              New Collection
            </h3>

            {error && (
              <p className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100 p-2.5 rounded-lg mb-3">
                {error}
              </p>
            )}

            <form onSubmit={handleCreateCookbook} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Collection Title (e.g. Italian)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-brand-500 rounded-xl text-xs transition-premium outline-none"
                  required
                />
              </div>
              <div>
                <textarea
                  rows="2"
                  placeholder="Short Description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-brand-500 rounded-xl text-xs transition-premium outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={createLoading}
                className="w-full py-2 bg-slate-900 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-premium shadow-sm active:scale-95 flex items-center justify-center gap-1"
              >
                {createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
              </button>
            </form>
          </div>

          {/* Cookbooks List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-premium">
            <h3 className="font-display font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Library className="w-4.5 h-4.5 text-brand-500" />
              Collections ({cookbooks.length})
            </h3>
            
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
              </div>
            ) : cookbooks.length === 0 ? (
              <p className="text-center py-4 text-xs text-slate-400">No collections created yet.</p>
            ) : (
              <div className="space-y-1.5 max-h-80 overflow-y-auto">
                {cookbooks.map((cb) => {
                  const isSelected = selectedCookbook?._id === cb._id;
                  return (
                    <button
                      key={cb._id}
                      onClick={() => fetchCookbookDetails(cb._id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-premium text-left text-xs ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50 text-brand-500 font-bold'
                          : 'border-slate-100 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate pr-2">{cb.title}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold">
                          {cb.recipes?.length || 0}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Cookbook details & Recipe Cards */}
        <div className="lg:col-span-3">
          {loadingDetails ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-2" />
              <p className="text-sm font-semibold">Opening binder...</p>
            </div>
          ) : !selectedCookbook ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-slate-100 shadow-premium">
              <FolderHeart className="w-10 h-10 text-slate-350 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-semibold">Select a collection on the left</p>
              <p className="text-xs text-slate-400">Or build a new one to organize your recipes.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cookbook title section */}
              <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl shadow-premium">
                <div>
                  <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
                    {selectedCookbook.title}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedCookbook.description || 'No description provided.'}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCookbook(selectedCookbook._id)}
                  title="Delete Cookbook"
                  className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-500 hover:text-rose-600 rounded-2xl transition-premium active:scale-95 shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Recipe grid list in selected cookbook */}
              {selectedCookbook.recipes?.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-premium">
                  <Sparkles className="w-8 h-8 text-slate-350 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm font-semibold">No recipes in this cookbook yet</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    Navigate to the{' '}
                    <Link to="/explore" className="font-semibold text-brand-500 hover:underline">
                      Explore Page
                    </Link>{' '}
                    and click the bookmark button on any recipe card to add it!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {selectedCookbook.recipes.map((recipe) => (
                    <div key={recipe._id} className="relative">
                      {/* Recipe card itself */}
                      <RecipeCard recipe={recipe} onCookbookAdded={() => fetchCookbookDetails(selectedCookbook._id)} />
                      
                      {/* Floating Remove Button specifically on the cookbooks page */}
                      <button
                        onClick={() => handleRemoveRecipe(recipe._id)}
                        title="Remove from Cookbook"
                        className="absolute top-4 left-4 z-20 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition-premium backdrop-blur-sm shadow-sm"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Cookbooks;

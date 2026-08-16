import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Plus, Trash2, Clock, Users, Flame, Info, Loader2, Sparkles, PlusSquare } from 'lucide-react';
import api from '../services/api';
import ImageUploadZone from '../components/ImageUploadZone';

const CreateRecipe = () => {
  const navigate = useNavigate();

  // Basic Details State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [tagsInput, setTagsInput] = useState('');

  // Image Upload State
  const [imageFile, setImageFile] = useState(null);

  // Dynamic Lists State
  const [ingredients, setIngredients] = useState([
    { name: '', quantity: '', unit: 'g' }
  ]);
  const [instructions, setInstructions] = useState(['']);

  // Nutrition state (optional)
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbohydrates, setCarbohydrates] = useState('');
  const [fat, setFat] = useState('');

  // Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Ingredient Row Changes
  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  // Add Ingredient Row
  const addIngredientRow = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: 'g' }]);
  };

  // Remove Ingredient Row
  const removeIngredientRow = (index) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Handle Instruction Step Changes
  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  // Add Instruction Step
  const addInstructionStep = () => {
    setInstructions([...instructions, '']);
  };

  // Remove Instruction Step
  const removeInstructionStep = (index) => {
    if (instructions.length === 1) return;
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation checks
    if (!title.trim() || !description.trim() || !prepTime || !cookTime || !servings) {
      setError('Please fill in all basic fields');
      return;
    }

    if (!imageFile) {
      setError('Please upload a recipe image');
      return;
    }

    // Filter out blank ingredients or instructions
    const validIngredients = ingredients.filter(ing => ing.name.trim() && ing.quantity);
    if (validIngredients.length === 0) {
      setError('Please add at least one valid ingredient (with name and quantity)');
      return;
    }

    const validInstructions = instructions.filter(step => step.trim());
    if (validInstructions.length === 0) {
      setError('Please add at least one instruction step');
      return;
    }

    setLoading(true);
    try {
      // Build FormData for multipart uploads
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('prepTime', prepTime);
      formData.append('cookTime', cookTime);
      formData.append('servings', servings);
      formData.append('difficulty', difficulty);
      formData.append('image', imageFile);

      // Parse tags
      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);
      formData.append('tags', JSON.stringify(tags));

      // Append ingredients & instructions stringified
      formData.append('ingredients', JSON.stringify(validIngredients.map(ing => ({
        name: ing.name.trim(),
        quantity: Number(ing.quantity),
        unit: ing.unit.trim()
      }))));
      formData.append('instructions', JSON.stringify(validInstructions));

      // Append nutritionalInfo
      const nutrition = {
        calories: calories ? Number(calories) : 0,
        protein: protein ? Number(protein) : 0,
        carbohydrates: carbohydrates ? Number(carbohydrates) : 0,
        fat: fat ? Number(fat) : 0
      };
      formData.append('nutritionalInfo', JSON.stringify(nutrition));

      const response = await api.post('/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        navigate('/explore');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight flex items-center gap-2">
          <PlusCircle className="w-7 h-7 text-brand-500 fill-brand-50" />
          Share Your Recipe
        </h1>
        <p className="text-slate-500 mt-1">Publish your cooking creations for the global home-chefs community.</p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 text-sm font-semibold">
          <Info className="w-4 h-4 text-rose-500 shrink-0" />
          {error}
        </div>
      )}

      {/* Main Creation form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Row 1: Basic info card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Recipe Title
              </label>
              <input
                type="text"
                placeholder="Classic Margherita Pizza"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 focus:border-brand-500 rounded-xl text-sm transition-premium outline-none"
                required
              />
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Short Description
              </label>
              <textarea
                rows="4"
                placeholder="A simple yet delicious Neapolitan classic featuring thin crust..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 focus:border-brand-500 rounded-xl text-sm transition-premium outline-none resize-none"
                required
              />
            </div>
          </div>

          {/* Drag and drop uploader */}
          <div className="flex flex-col">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Recipe Cover Photo
            </label>
            <div className="flex-grow flex items-center">
              <ImageUploadZone onFileSelect={setImageFile} />
            </div>
          </div>
        </div>

        {/* Row 2: Metrics grid */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Prep Time */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-500" />
              Prep Time (mins)
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 15"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 focus:border-brand-500 rounded-xl text-sm transition-premium outline-none"
              required
            />
          </div>

          {/* Cook Time */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-500" />
              Cook Time (mins)
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 20"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 focus:border-brand-500 rounded-xl text-sm transition-premium outline-none"
              required
            />
          </div>

          {/* Servings */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-brand-500" />
              Servings
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 4"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 focus:border-brand-500 rounded-xl text-sm transition-premium outline-none"
              required
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-brand-500" />
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 focus:border-brand-500 rounded-xl text-sm bg-white transition-premium outline-none cursor-pointer"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Row 3: Dynamic Ingredients Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-brand-500 fill-brand-50" />
              Ingredients List
            </h3>
            <button
              type="button"
              onClick={addIngredientRow}
              className="flex items-center gap-1 text-xs font-bold text-brand-500 hover:text-brand-600 transition-premium"
            >
              <Plus className="w-4 h-4" />
              Add Row
            </button>
          </div>

          <div className="space-y-3">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                {/* Ingredient name */}
                <input
                  type="text"
                  placeholder="Ingredient Name (e.g. Flour)"
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                  className="flex-grow px-3 py-2 border border-slate-200 focus:border-brand-500 rounded-xl text-sm transition-premium outline-none"
                  required
                />
                {/* Quantity */}
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  placeholder="Qty"
                  value={ing.quantity}
                  onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)}
                  className="w-20 px-3 py-2 border border-slate-200 focus:border-brand-500 rounded-xl text-sm transition-premium outline-none"
                  required
                />
                {/* Unit */}
                <input
                  type="text"
                  placeholder="Unit"
                  value={ing.unit}
                  onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                  className="w-24 px-3 py-2 border border-slate-200 focus:border-brand-500 rounded-xl text-sm transition-premium outline-none"
                  required
                />
                {/* Remove row */}
                <button
                  type="button"
                  disabled={ingredients.length === 1}
                  onClick={() => removeIngredientRow(idx)}
                  className="p-2 border border-slate-200 hover:border-red-500 text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 rounded-xl transition-premium active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Row 4: Dynamic Instructions Steps */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-brand-500" />
              Preparation steps
            </h3>
            <button
              type="button"
              onClick={addInstructionStep}
              className="flex items-center gap-1 text-xs font-bold text-brand-500 hover:text-brand-600 transition-premium"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </button>
          </div>

          <div className="space-y-4">
            {instructions.map((step, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <span className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0 border mt-1">
                  {idx + 1}
                </span>
                <textarea
                  rows="2"
                  placeholder="Preheat oven to 350 degrees..."
                  value={step}
                  onChange={(e) => handleInstructionChange(idx, e.target.value)}
                  className="flex-grow px-3 py-2 border border-slate-200 focus:border-brand-500 rounded-xl text-sm transition-premium outline-none resize-none"
                  required
                />
                <button
                  type="button"
                  disabled={instructions.length === 1}
                  onClick={() => removeInstructionStep(idx)}
                  className="p-2 border border-slate-200 hover:border-red-500 text-slate-400 hover:text-red-500 disabled:opacity-35 rounded-xl transition-premium active:scale-95 mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Row 5: Tags and Optional Nutrition Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <PlusSquare className="w-4.5 h-4.5 text-brand-500" />
              Discovery tags
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Comma Separated Tags list
              </label>
              <input
                type="text"
                placeholder="Italian, Pizza, Dinner, Quick"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 focus:border-brand-500 rounded-xl text-sm transition-premium outline-none"
              />
              <p className="text-[10px] text-slate-400 font-semibold mt-1">
                Tags help other chefs find your recipe in the search panel.
              </p>
            </div>
          </div>

          {/* Optional Nutrition */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Info className="w-4.5 h-4.5 text-brand-500" />
              Nutritional metrics (Optional)
            </h3>
            
            <div className="grid grid-cols-4 gap-2.5">
              {/* Calories */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cals</label>
                <input
                  type="number"
                  min="0"
                  placeholder="kcal"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-xl text-xs transition-premium outline-none"
                />
              </div>
              {/* Protein */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Protein</label>
                <input
                  type="number"
                  min="0"
                  placeholder="g"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-xl text-xs transition-premium outline-none"
                />
              </div>
              {/* Carbs */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Carbs</label>
                <input
                  type="number"
                  min="0"
                  placeholder="g"
                  value={carbohydrates}
                  onChange={(e) => setCarbohydrates(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-xl text-xs transition-premium outline-none"
                />
              </div>
              {/* Fat */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fat</label>
                <input
                  type="number"
                  min="0"
                  placeholder="g"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-xl text-xs transition-premium outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit action */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-grow py-3.5 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white rounded-2xl text-sm font-bold transition-premium flex items-center justify-center gap-1.5 shadow-md shadow-brand-200 active:scale-98"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Publish Recipe'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="px-6 py-3.5 border border-slate-200 hover:bg-slate-50 rounded-2xl text-sm font-bold text-slate-500 transition-premium"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateRecipe;

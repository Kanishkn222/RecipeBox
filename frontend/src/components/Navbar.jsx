import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Compass, Rss, FolderHeart, Calendar, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
    ${isActive(path)
      ? 'bg-brand-500 text-white shadow-sm'
      : 'text-slate-600 hover:bg-brand-100 hover:text-brand-600'}
  `;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Back button & Logo section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="px-2.5 py-1 bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1 shadow-sm"
            >
              ← Back
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-brand-500 text-white">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-slate-900">
                Recipe<span className="text-brand-500">Box</span>
              </span>
            </Link>
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/explore" className={linkClass('/explore')}>
              <Compass className="w-4 h-4" />
              Explore
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/feed" className={linkClass('/feed')}>
                  <Rss className="w-4 h-4" />
                  Feed
                </Link>
                <Link to="/cookbooks" className={linkClass('/cookbooks')}>
                  <FolderHeart className="w-4 h-4" />
                  Cookbooks
                </Link>
                <Link to="/meals" className={linkClass('/meals')}>
                  <Calendar className="w-4 h-4" />
                  Meal Planner
                </Link>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-recipe"
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-xl shadow-sm transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create Recipe
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
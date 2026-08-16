import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

// Components
import Navbar from './components/Navbar';

// Pages
import Explore from './pages/Explore';
import RecipeDetails from './pages/RecipeDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Cookbooks from './pages/Cookbooks';
import MealPlanner from './pages/MealPlanner';
import CreateRecipe from './pages/CreateRecipe';

// CSS imports
import './App.css';

/**
 * Higher-order component to restrict access to authenticated users only.
 * Automatically handles auth-check loading states.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-brand-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-brand-50">
          
          {/* Main Navigation */}
          <Navbar />

          {/* Main App Workspace */}
          <main className="flex-grow">
            <Routes>
              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/explore" replace />} />
              
              {/* Public Discovery Routes */}
              <Route path="/explore" element={<Explore />} />
              <Route path="/recipes/:id" element={<RecipeDetails />} />
              
              {/* Auth Forms */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected User Screens */}
              <Route 
                path="/feed" 
                element={
                  <ProtectedRoute>
                    <Feed />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cookbooks" 
                element={
                  <ProtectedRoute>
                    <Cookbooks />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/meals" 
                element={
                  <ProtectedRoute>
                    <MealPlanner />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-recipe" 
                element={
                  <ProtectedRoute>
                    <CreateRecipe />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/explore" replace />} />
            </Routes>
          </main>

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

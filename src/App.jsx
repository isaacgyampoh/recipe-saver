import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Placeholder pages
const Home = () => <div className="text-center text-2xl mt-10">Welcome to Recipe Saver!</div>;
const CreateRecipe = () => <div>Create Recipe Page</div>;
const EditRecipe = () => <div>Edit Recipe Page</div>;
const RecipeDetails = () => <div>Recipe Details Page</div>;

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Layout session={session}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/" />} />
        <Route path="/create-recipe" element={session ? <CreateRecipe /> : <Navigate to="/login" />} />
        <Route path="/edit-recipe/:id" element={session ? <EditRecipe /> : <Navigate to="/login" />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Routes>
    </Layout>
  );
}

export default App;

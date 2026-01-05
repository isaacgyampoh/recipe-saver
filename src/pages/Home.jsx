import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import RecipeCard from '../components/RecipeCard';
import SEO from '../components/SEO';
import { Loader2, PlusCircle } from 'lucide-react';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    const searchQuery = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all'; // 'all' or 'favorites'
    const categoryFilter = searchParams.get('category') || 'all';

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('recipes')
                .select('*')
                .order('created_at', { ascending: false });

            if (searchQuery) {
                query = query.ilike('title', `%${searchQuery}%`);
            }

            if (filter === 'favorites') {
                query = query.eq('is_favorite', true);
            }

            if (categoryFilter !== 'all') {
                query = query.eq('category', categoryFilter);
            }

            const { data, error } = await query;

            if (error) throw error;
            setRecipes(data || []);
        } catch (error) {
            console.error('Error fetching recipes:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, [searchQuery, filter, categoryFilter]);

    const toggleFavorite = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('recipes')
                .update({ is_favorite: currentStatus })
                .eq('id', id);

            if (error) throw error;

            // Optimistic update
            setRecipes(recipes.map(r =>
                r.id === id ? { ...r, is_favorite: currentStatus } : r
            ));
        } catch (error) {
            console.error('Error updating favorite:', error.message);
        }
    };

    const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];

    return (
        <div>
            <SEO title="Dashboard" description="View and manage your recipe collection." />
            {/* Filters */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    <Link
                        to="/"
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${categoryFilter === 'all' && filter === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        All
                    </Link>
                    <Link
                        to="/?filter=favorites"
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'favorites'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        Favorites
                    </Link>
                    {categories.map(cat => (
                        <Link
                            key={cat}
                            to={`/?category=${cat}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${categoryFilter === cat
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-200">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                        <PlusCircle className="h-12 w-12" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No recipes found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating a new recipe.'}
                    </p>
                    {!searchQuery && (
                        <div className="mt-6">
                            <Link
                                to="/create-recipe"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                New Recipe
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;

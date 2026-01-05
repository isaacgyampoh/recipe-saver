import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SEO from '../components/SEO';
import { Loader2, Clock, Users, Heart, Edit, Trash2, ChevronLeft } from 'lucide-react';

const RecipeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .eq('id', id)
                .single();

            if (!error) {
                setRecipe(data);
            }
            setLoading(false);
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from('recipes')
                .delete()
                .eq('id', id);

            if (error) throw error;
            navigate('/');
        } catch (error) {
            alert('Error deleting recipe: ' + error.message);
        }
    };

    const toggleFavorite = async () => {
        if (!recipe) return;
        const newStatus = !recipe.is_favorite;

        // Optimistic update
        setRecipe({ ...recipe, is_favorite: newStatus });

        const { error } = await supabase
            .from('recipes')
            .update({ is_favorite: newStatus })
            .eq('id', id);

        if (error) {
            // Revert on error
            setRecipe({ ...recipe, is_favorite: !newStatus });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Recipe not found</h2>
                <Link to="/" className="text-primary hover:underline mt-4 inline-block">
                    Back to Home
                </Link>
            </div>
        );
    }

    const isOwner = currentUser && currentUser.id === recipe.user_id;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <SEO title={recipe.title} description={recipe.description} />
            {/* Header Image */}
            <div className="relative h-64 sm:h-96 bg-gray-200">
                {recipe.image_url ? (
                    <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        <span className="text-6xl">🍳</span>
                    </div>
                )}
                <Link
                    to="/"
                    className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Link>
            </div>

            <div className="p-6 sm:p-10">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-secondary/20 text-secondary-dark rounded-full text-sm font-medium text-secondary">
                                {recipe.category}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
                        {recipe.description && (
                            <p className="text-gray-600 text-lg">{recipe.description}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleFavorite}
                            className={`p-2 rounded-full border transition-colors ${recipe.is_favorite
                                ? 'bg-red-50 border-red-200 text-red-500'
                                : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                                }`}
                        >
                            <Heart className={`h-6 w-6 ${recipe.is_favorite ? 'fill-current' : ''}`} />
                        </button>
                        {isOwner && (
                            <>
                                <Link
                                    to={`/edit-recipe/${id}`}
                                    className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                                >
                                    <Edit className="h-6 w-6" />
                                </Link>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="h-6 w-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-6 mb-8">
                    <div className="text-center border-r border-gray-100 last:border-0">
                        <div className="flex items-center justify-center text-gray-400 mb-1">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div className="font-semibold text-gray-900">
                            {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                        </div>
                        <div className="text-xs text-gray-500">Total Time</div>
                    </div>
                    <div className="text-center border-r border-gray-100 last:border-0">
                        <div className="flex items-center justify-center text-gray-400 mb-1">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div className="font-semibold text-gray-900">{recipe.prep_time || 0} min</div>
                        <div className="text-xs text-gray-500">Prep Time</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center text-gray-400 mb-1">
                            <Users className="h-5 w-5" />
                        </div>
                        <div className="font-semibold text-gray-900">{recipe.servings || '-'}</div>
                        <div className="text-xs text-gray-500">Servings</div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Ingredients */}
                    <div className="md:col-span-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h3>
                        <ul className="space-y-3">
                            {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="h-2 w-2 mt-2 mr-3 bg-primary rounded-full shrink-0" />
                                    <span className="text-gray-700">{ingredient}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Instructions */}
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Instructions</h3>
                        <div className="prose prose-orange text-gray-700 whitespace-pre-line">
                            {recipe.instructions}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Recipe?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeDetails;

import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Heart } from 'lucide-react';
import { supabase } from '../supabaseClient';

const RecipeCard = ({ recipe, onToggleFavorite }) => {
    const { id, title, image_url, prep_time, cook_time, servings, category, is_favorite } = recipe;
    const totalTime = (prep_time || 0) + (cook_time || 0);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <div className="relative h-48 bg-gray-200">
                {image_url ? (
                    <img
                        src={image_url}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        <span className="text-4xl">🍳</span>
                    </div>
                )}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onToggleFavorite(id, !is_favorite);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors ${is_favorite ? 'text-red-500' : 'text-gray-400'
                        }`}
                >
                    <Heart className={`h-5 w-5 ${is_favorite ? 'fill-current' : ''}`} />
                </button>
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700 uppercase tracking-wide">
                    {category || 'Uncategorized'}
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <Link to={`/recipe/${id}`} className="block group">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                        {title}
                    </h3>
                </Link>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{totalTime > 0 ? `${totalTime} min` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{servings ? `${servings} ppl` : 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;

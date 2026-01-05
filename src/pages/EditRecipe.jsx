import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import RecipeForm from '../components/RecipeForm';
import SEO from '../components/SEO';
import { Loader2 } from 'lucide-react';

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                const { data, error } = await supabase
                    .from('recipes')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                // Check ownership
                if (data.user_id !== user.id) {
                    navigate('/');
                    return;
                }

                setRecipe(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-600">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <SEO title="Edit Recipe" description="Edit your recipe." />
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Recipe</h1>
            {recipe && <RecipeForm initialData={recipe} isEditing={true} />}
        </div>
    );
};

export default EditRecipe;

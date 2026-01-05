import React from 'react';
import RecipeForm from '../components/RecipeForm';
import SEO from '../components/SEO';

const CreateRecipe = () => {
    return (
        <div className="max-w-3xl mx-auto">
            <SEO title="Create Recipe" description="Add a new recipe to your collection." />
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Recipe</h1>
            <RecipeForm />
        </div>
    );
};

export default CreateRecipe;

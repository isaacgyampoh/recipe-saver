import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Loader2, Plus, Trash2, Upload, X } from 'lucide-react';

const RecipeForm = ({ initialData, isEditing = false }) => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(initialData?.image_url || null);
    const [submitError, setSubmitError] = useState(null);

    const { register, control, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            ingredients: initialData?.ingredients?.map(i => ({ value: i })) || [{ value: '' }],
            instructions: initialData?.instructions || '',
            prep_time: initialData?.prep_time || '',
            cook_time: initialData?.cook_time || '',
            servings: initialData?.servings || '',
            category: initialData?.category || 'Dinner',
            image_url: initialData?.image_url || '',
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ingredients'
    });

    const handleImageUpload = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('recipe-photos')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('recipe-photos').getPublicUrl(filePath);

            setValue('image_url', data.publicUrl);
            setImagePreview(data.publicUrl);
        } catch (error) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        setSubmitError(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const recipeData = {
                title: data.title,
                description: data.description,
                ingredients: data.ingredients.map(i => i.value).filter(i => i.trim() !== ''),
                instructions: data.instructions,
                prep_time: parseInt(data.prep_time) || 0,
                cook_time: parseInt(data.cook_time) || 0,
                servings: parseInt(data.servings) || 0,
                category: data.category,
                image_url: data.image_url,
                user_id: user.id,
            };

            let error;
            if (isEditing) {
                const { error: updateError } = await supabase
                    .from('recipes')
                    .update(recipeData)
                    .eq('id', initialData.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('recipes')
                    .insert([recipeData]);
                error = insertError;
            }

            if (error) throw error;
            navigate('/');
        } catch (error) {
            setSubmitError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg shadow-md">
            {submitError && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md">
                    {submitError}
                </div>
            )}

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Photo</label>
                <div className="flex items-center space-x-6">
                    <div className="shrink-0">
                        {imagePreview ? (
                            <div className="relative h-32 w-32 object-cover rounded-lg overflow-hidden">
                                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview(null);
                                        setValue('image_url', '');
                                    }}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg hover:bg-red-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                <span className="text-4xl">📷</span>
                            </div>
                        )}
                    </div>
                    <label className="block">
                        <span className="sr-only">Choose profile photo</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-opacity-90
                cursor-pointer"
                        />
                        {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
                    </label>
                </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        {...register('title', { required: 'Title is required' })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        {...register('description')}
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        {...register('category')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    >
                        {['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Servings</label>
                    <input
                        type="number"
                        {...register('servings', { min: 1 })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Prep Time (mins)</label>
                    <input
                        type="number"
                        {...register('prep_time', { min: 0 })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Cook Time (mins)</label>
                    <input
                        type="number"
                        {...register('cook_time', { min: 0 })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>

            {/* Ingredients */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                            <input
                                {...register(`ingredients.${index}.value`, { required: true })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                placeholder="e.g. 2 cups flour"
                            />
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 text-gray-400 hover:text-red-500"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => append({ value: '' })}
                        className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Ingredient
                    </button>
                </div>
            </div>

            {/* Instructions */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Instructions</label>
                <textarea
                    {...register('instructions', { required: 'Instructions are required' })}
                    rows={6}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    placeholder="Step 1: ..."
                />
                {errors.instructions && <p className="mt-1 text-sm text-red-600">{errors.instructions.message}</p>}
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || uploading}
                    className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                            Saving...
                        </>
                    ) : (
                        'Save Recipe'
                    )}
                </button>
            </div>
        </form>
    );
};

export default RecipeForm;

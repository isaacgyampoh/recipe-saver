import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, User, LogOut, Heart, Menu, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Navbar = ({ session }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-primary">Recipe Saver</span>
                        </Link>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden lg:flex-1 lg:flex lg:items-center lg:justify-center px-2 lg:ml-6 lg:justify-end">
                        <form onSubmit={handleSearch} className="max-w-lg w-full lg:max-w-xs">
                            <label htmlFor="search" className="sr-only">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="search"
                                    name="search"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Search recipes..."
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex lg:items-center lg:ml-4">
                        {session ? (
                            <>
                                <Link to="/create-recipe" className="p-2 text-gray-400 hover:text-primary transition-colors" title="Add Recipe">
                                    <Plus className="h-6 w-6" />
                                </Link>
                                <Link to="/?filter=favorites" className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Favorites">
                                    <Heart className="h-6 w-6" />
                                </Link>
                                <div className="ml-3 relative group">
                                    <button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                        <span className="sr-only">Open user menu</span>
                                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-white">
                                            <User className="h-5 w-5" />
                                        </div>
                                    </button>
                                    {/* Dropdown menu */}
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                            {session.user.email}
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <div className="flex items-center">
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Sign out
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex space-x-4">
                                <Link to="/login" className="text-text hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                                    Log in
                                </Link>
                                <Link to="/signup" className="bg-primary text-white hover:bg-opacity-90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <form onSubmit={handleSearch} className="mb-4 px-2">
                            <label htmlFor="mobile-search" className="sr-only">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="mobile-search"
                                    name="search"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Search recipes..."
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>

                        {session ? (
                            <>
                                <Link
                                    to="/create-recipe"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    <div className="flex items-center">
                                        <Plus className="h-5 w-5 mr-2" />
                                        Add Recipe
                                    </div>
                                </Link>
                                <Link
                                    to="/?filter=favorites"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    <div className="flex items-center">
                                        <Heart className="h-5 w-5 mr-2" />
                                        Favorites
                                    </div>
                                </Link>
                                <div className="border-t border-gray-200 pt-4 pb-3">
                                    <div className="flex items-center px-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white">
                                                <User className="h-6 w-6" />
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-gray-800">{session.user.email}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 px-2 space-y-1">
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center">
                                                <LogOut className="h-5 w-5 mr-2" />
                                                Sign out
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-1">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

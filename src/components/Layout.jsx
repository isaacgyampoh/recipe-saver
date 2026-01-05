import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, session }) => {
    return (
        <div className="min-h-screen bg-background font-sans text-text">
            <Navbar session={session} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;

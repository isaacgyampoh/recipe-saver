import React from 'react';
import AuthForm from '../components/AuthForm';
import SEO from '../components/SEO';

const Signup = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <SEO title="Sign Up" description="Create a new Recipe Saver account." />
            <AuthForm type="signup" />
        </div>
    );
};

export default Signup;

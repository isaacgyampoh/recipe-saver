import React from 'react';
import AuthForm from '../components/AuthForm';
import SEO from '../components/SEO';

const Login = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <SEO title="Login" description="Log in to your Recipe Saver account." />
            <AuthForm type="login" />
        </div>
    );
};

export default Login;

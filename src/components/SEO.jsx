import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
    const siteTitle = 'Recipe Saver';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || 'Save and organize your favorite recipes.';

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
    );
};

export default SEO;

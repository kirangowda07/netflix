import React from 'react';

const GlassCard = ({ children, className = '' }) => {
    return (
        <div className={`glass-card p-8 md:p-12 ${className}`}>
            {children}
        </div>
    );
};

export default GlassCard;

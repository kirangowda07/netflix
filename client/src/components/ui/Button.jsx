import React from 'react';

const Button = ({ children, className = '', variant = 'primary', ...props }) => {
    const baseStyles = "px-4 py-3 rounded-md font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "netflix-btn",
        secondary: "bg-gray-500/50 hover:bg-gray-500/70 text-white",
        outline: "border border-gray-500 hover:border-white text-gray-300 hover:text-white"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

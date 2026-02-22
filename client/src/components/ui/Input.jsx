import React from 'react';

const Input = ({ label, type = 'text', className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && <label className="text-gray-300 text-sm">{label}</label>}
            <input
                type={type}
                className={`glass-input px-4 py-3 rounded-md w-full focus:ring-1 focus:ring-red-600 transition-all ${className}`}
                {...props}
            />
        </div>
    );
};

export default Input;

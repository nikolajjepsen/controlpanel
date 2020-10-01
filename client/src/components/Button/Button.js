import React from 'react';

import './Button.scss';

export const ButtonList = ({ className, children }) => {
    return <div className={`button-list ${className}`}>{children}</div>;
};

export const Button = ({ onClick, buttonClass, buttonSize, isActive, isLoading, icon }) => {
    // Note: Should probably use an actual button element, but for now this is fine.
    // Accessability is not really a concern.
    return (
        <button
            onClick={onClick}
            className={`btn btn-rounded btn-neumorphism ${buttonClass || ''} ${
                isLoading ? ' loading' : ''
            }`}
        >
            {icon}
        </button>
    );
};

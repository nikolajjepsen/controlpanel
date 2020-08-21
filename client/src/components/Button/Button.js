import React from 'react';

export const ButtonList = (props) => {
    return (
        <div className={`icon-list ${props.listClass}`}>
            {props.children}
        </div>
    )
}

export const Button = (props) => {
    const { onClick, buttonClass, buttonSize, isActive, isLoading, icon } = props;
    // Note: Should probably use an actual button element, but for now this is fine.
    // Accessability is not really a concern.
    return (
        <div className={`icon-container ${buttonClass} ${buttonSize || ''}${isActive ? ' active' : ''}`} onClick={onClick}>
            <div className={`button ${buttonClass || ''} ${isLoading ? ' loading' : ''}`}></div>
            {icon}
        </div>
    );
}
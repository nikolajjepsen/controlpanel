import React from 'react';

const Task = ({ id, title, amount, type, completed, ...props }) => {
    return (
        <div className={`item ${type}`} key={id}>
            <input
                className="invisible-checkbox"
                type="checkbox"
                id={id}
                style={{ display: 'none' }}
                defaultChecked={completed}
            ></input>
            <label className="label" htmlFor={id} onClick={() => props.onCompleted(id)}>
                <span className="checkbox">
                    <svg width="12px" height="12px" viewBox="0 0 12 9">
                        <polyline points="1 5 4 8 11 1"></polyline>
                    </svg>
                </span>
                <span className="title-container">
                    <span className="title">{title}</span>
                    {props.type === 'shopping' && <span className="amount">{amount}</span>}
                </span>
            </label>
            <span className="action-container">
                <span className="delete" onClick={() => props.onDelete(id)}>
                    <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        stroke="currentColor"
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                </span>
            </span>
        </div>
    );
};

export default Task;

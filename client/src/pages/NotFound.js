import React from 'react';

import './NotFound.scss';

const NotFound = () => {
    return (
        <main id="not-found">
            <div className="not-found-container content-wrapper">
                <span className="error-code">404</span>
                <span className="divider">|</span>
                <span className="message">Not Found</span>
            </div>
        </main>
    );
};

export default NotFound;

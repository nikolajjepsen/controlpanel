import React from 'react';
import EmailSender from './EmailSender';
import EmailDate from './EmailDate';

const Email = ({ subject, date, from }) => {
    return (
        <div className="email">
            <div className="details">
                <span className="subject">{subject}</span>
                <EmailDate dateString={date} />
            </div>
            <div className="from">
                <EmailSender fromString={from} />
            </div>
        </div>
    );
};

export default Email;

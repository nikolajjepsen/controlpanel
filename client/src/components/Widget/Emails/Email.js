import React from 'react';
import EmailSender from './EmailSender';
import EmailDate from './EmailDate';

const Email = (props) => {
    return (
        <div className="item">
            <span className="subject">{props.subject}</span>
            <div className="details">
                <EmailSender fromString={props.from} />
                <EmailDate dateString={props.date} />
            </div>
        </div>
    )
}

export default Email;
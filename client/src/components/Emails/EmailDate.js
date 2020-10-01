import React from 'react';

const EmailDate = ({ dateString }) => {
    const emailDate = new Date(Date.parse(dateString));
    let options;

    if (emailDate.toDateString() === new Date().toDateString()) {
        options = {
            hour: '2-digit',
            minute: '2-digit',
        };
    } else {
        options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        };
    }

    return <span className="date">{emailDate.toLocaleString('da-DK', options)}</span>;
};

export default EmailDate;

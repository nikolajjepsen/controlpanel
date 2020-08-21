import React from 'react';

const CalendarList = (props) => {
    const { items } = props;
    return (
        <div className="widget-container">
            <p>Calendar loaded</p>
            <p>{JSON.stringify(items)}</p>
        </div>
    )
}

export default CalendarList;
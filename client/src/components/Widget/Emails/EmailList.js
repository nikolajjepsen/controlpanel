import React from 'react';
import Email from './Email'

const EmailList = (props) => {
    const { items } = props;
    // Temporary workaround. Data is being sent before it's been changed from ../Widgets.js.
    // Loading is set to false before data was updated???
    // May need a useEffect to disable loading animations and renderers, however that's causing issues as well.
    // ^ TODO ^ FIX
    if (items[0].from) {
        return (
            <div className="widget-container">
                <div className="header emails">
                    <h2>Emails</h2>
                </div>
                <div className="body emails">
                    {
                        items.map((item) => (
                            <Email
                                from={item.from}
                                date={item.date}
                                subject={item.subject}
                            />
                        ))
                    }
                </div>
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}

export default EmailList;
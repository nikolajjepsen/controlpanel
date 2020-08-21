import React from 'react';

const EmailList = (props) => {
    const { items } = props;
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
}

export default EmailList;
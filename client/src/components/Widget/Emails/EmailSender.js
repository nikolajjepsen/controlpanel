import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const EmailSender = (props) => {
    console.log(props);
    const senderString = props.fromString;

    let senderEmail = senderString.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i)[0];
    let senderName = senderString
        .replace(senderEmail, '')
        .replace('<>', '')
        .replace('"', '');

    // If from is only an email, display the email
    if (senderName.length === 0) {
        return (
            <span className="from">{senderEmail}</span>
        )
    // If we also found a name
    } else if (senderName.length > 0) {
        return (
            <OverlayTrigger
                key={senderEmail}
                placement="top"
                overlay={
                    <Tooltip id={`tooltip-top`}>
                        {senderEmail}
                    </Tooltip>
                }
            >
                <span className="from">{senderName}</span>
            </OverlayTrigger>
        )
    // Unrealistic case of no email and no sender name.
    } else {
        return (
            <span className="from">Unable to determine sender</span>
        )
    }
}

export default EmailSender;
import React from 'react';
import EmailSender from './EmailSender';
import EmailDate from './EmailDate';

const Email = (props) => {
	return (
		<div className="email">
			<div className="details">
				<span class="subject">{props.subject}</span>
				<EmailDate dateString={props.date} />
			</div>
			<div className="from">
				<EmailSender fromString={props.from} />
			</div>
		</div>
	);
};

export default Email;

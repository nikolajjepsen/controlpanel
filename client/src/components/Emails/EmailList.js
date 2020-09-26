import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import Email from './Email';
import Section from './../Section/Section';
import LoadingIndicator from './../LoadingIndicator';

import backend from './../../config/axios.config';
import './Email.scss';

const EmailList = () => {
	const [emails, setEmails] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		const fetchEmails = async () => {
			const response = await backend.get('/google/emails/10');
			setEmails(response.data);
			setIsLoading(false);
		};
		fetchEmails();
	}, []);

	return (
		<>
			<Section title="Emails">
				<Col xs={12}>
					<div className="emails">
						{!isLoading &&
							emails.map((email) => (
								<Email
									from={email.from}
									date={email.date}
									subject={email.subject}
									key={email.from + email.date}
								/>
							))}

						{isLoading && <LoadingIndicator />}
					</div>
				</Col>
			</Section>
		</>
	);
};

export default EmailList;

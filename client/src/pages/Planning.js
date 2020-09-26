import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import EmailList from './../components/Emails/EmailList';

const Planning = ({ showGreeting }) => {
	useEffect(() => {
		showGreeting(false);
	}, []);
	return (
		<Row>
			<Col xs={12} lg={6}>
				<EmailList />
			</Col>
			<Col xs={12} lg={6}></Col>
		</Row>
	);
};

export default Planning;

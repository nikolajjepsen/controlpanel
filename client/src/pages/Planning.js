import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import EmailList from './../components/Emails/EmailList';
import Player from './../components/Player/Player';

const Planning = ({ showGreeting }) => {
	useEffect(() => {
		showGreeting(false);
	}, []);
	return (
		<>
			<Row className="planning">
				<Col xs={12} lg={6}>
					<EmailList />
				</Col>
				<Col xs={12} lg={6}></Col>
			</Row>

			<div className="fixed-bottom">
				<Player size="small" />
			</div>
		</>
	);
};

export default Planning;

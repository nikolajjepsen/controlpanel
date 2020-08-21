import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import './components/Button/Button.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Greeting from './components/Greeting/Greeting.js';
import Widgets from './components/Widget/Widgets.js';
import ActiveAuthorizations from './components/Authorization/Authorization.js';
import Player from './components/Player/Player.js';
import LightGroupList from './components/HueLights/LightGroupList';
import SingleLightGroup from './components/HueLights/SingleLightGroup';

const App = () => {
	// create a state on whether we have selected a hue light group.
	// replaces the widgets.
	const [displayLightGroupId, setDisplayLightGroupId] = useState(null);

	return (
		<Container fluid>
			<Row>
				<Col lg={7} md={12} className="left-container pt-5">
					<Greeting />
					<ActiveAuthorizations />
					<Row className="mt-4">
						<Col sm={12} md={6} lg={5}>
							<Player />
						</Col>
						<Col sm={12} md={6} lg={7}>
							<LightGroupList
								onSelectGroup={setDisplayLightGroupId}
							/>
						</Col>
					</Row>
				</Col>
				{
					!displayLightGroupId && 
					<Col lg={5} sm={12} className="right-container pt-5 alt-bg">
						<Widgets
							showTasks
							showEmail
							showCalender
						/>
					</Col>
				}
				{
					displayLightGroupId &&
					<Col lg={5} sm={12} className="right-container pt-5 alt-bg">
						<SingleLightGroup
						onCancel={setDisplayLightGroupId}
						id={displayLightGroupId} />
					</Col>
				}
			</Row>
		</Container>
	);
}

export default App;

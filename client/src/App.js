import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import './components/Button/Button.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Greeting from './components/Greeting/Greeting.js';
import Widgets from './components/Widget/Widgets.js';
import Authorization from './components/Authorization/Authorization.js';
import Player from './components/Player/Player.js';
import LightGroupList from './components/HueLights/LightGroupList';
import SingleLightGroup from './components/HueLights/SingleLightGroup';

import backend from './config/axios.config';

const App = () => {
	// create a state on whether we have selected a hue light group.
	// replaces the widgets.
	const [displayLightGroupId, setDisplayLightGroupId] = useState(null);
	const [activeAuthorizations, setActiveAuthorizations] = useState([]);

	useEffect(() => {
		backend.get(`/auth/getCurrent`)
			.then(response => {
				// Returns an array of connected APIs (google | spotify atm)
				setActiveAuthorizations(response.data)
			})
			.catch(err => { console.log(err) });
	}, []);

	return (
		<Container fluid>
			<Row>
				<Col lg={7} md={12} className="left-container pt-5">
					<Greeting />
					<Authorization enabled={activeAuthorizations}  />
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
							authorizations={activeAuthorizations}
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

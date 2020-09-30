import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container, Col, Row } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

import Home from './pages/Home';
import Planning from './pages/Planning';
import NotFound from './pages/NotFound';
import Navigation from './components/Navigation';
import Clock from './components/Clock/Clock';

const App = () => {
	const [showClockGreeting, setShowClockGreeting] = useState(true);

	return (
		<Container>
			<Router>
				<Row>
					<Col lg={12}>
						<Clock withGreeting={showClockGreeting} />
					</Col>
					<Col sm={12}>
						<Navigation />
					</Col>
				</Row>
				<Row>
					<Col xl={12} sm={12}>
						<Switch>
							<Route path="/" exact>
								<Home showGreeting={setShowClockGreeting} />
							</Route>
							<Route path="/planning">
								<Planning showGreeting={setShowClockGreeting} />
							</Route>
							<Route path="*">
								<NotFound />
							</Route>
						</Switch>
					</Col>
				</Row>
			</Router>
		</Container>
	);
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container, Col, Row } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import './components/Button/Button.css';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Navigation from './components/Navigation';

const App = () => {
	return (
		<Container fluid>
			<Router>
				<Row>
					<Col xl={1} sm={12}>
						<Navigation />
					</Col>
					<Col xl={11} sm={12}>
						<Switch>
							<Route path="/" exact>
								<Home />
							</Route>
							<Route path="/tasks">
								<Home />
							</Route>
							<Route path="/emails">
								<Home />
							</Route>
							<Route path="/calendar">
								<Home />
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

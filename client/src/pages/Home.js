import React from 'react';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Clock from "./../components/Clock/Clock";
import TaskList from '../components/Tasks/TaskList';

import Player from "./../components/Player/Player.js";
import LightGroupList from "./../components/Lights/LightGroupList";
import FavoriteScenesList from "./../components/Lights/FavoriteScenesList";


const Home = () => {
    return (
		<>
			<Row>
				<Col lg={12}>
					<Clock withGreeting={true} />
				</Col>
			</Row>
			<Row className="mt-4">
				<Col sm={12} md={6} lg={4}>
					<Row>
						<Col xs={12}>
							<Player />
						</Col>
						<Col xs={12}>
							<TaskList />
						</Col>
					</Row>
				</Col>
				<Col sm={12} md={6} lg={8}>
					<Row>
						<Col xs={12}>
							<LightGroupList />
						</Col>
						<Col xs={12}>
							<FavoriteScenesList />
						</Col>
					</Row>
				</Col>
			</Row>
		</>
	);
};

export default Home;
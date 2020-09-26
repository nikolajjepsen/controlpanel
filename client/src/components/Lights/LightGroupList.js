import React, { useState, useEffect } from 'react';
import Section from './../Section/Section';

import backend from '../../config/axios.config';
import LightGroup from './LightGroup';
import LoadingIndicator from './../LoadingIndicator';

const LightGroupList = () => {
	const [groups, setGroups] = useState(null);
	const [expandedGroup, setExpandedGroup] = useState();
	const [isLoading, setIsLoading] = useState(true);

	const expandLightGroup = (id) => {
		if (expandedGroup === id) {
			setExpandedGroup(null);
		} else {
			setExpandedGroup(id);
		}
	};

	useEffect(() => {
		setIsLoading(true);
		backend
			.get('/hue/groups/list')
			.then((response) => {
				setGroups(response.data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);
	return (
		<Section title="Rooms">
			{(isLoading || !groups || !groups.length > 0) && <LoadingIndicator />}
			{!isLoading &&
				groups &&
				groups.length > 0 &&
				groups.map((group) => (
					<LightGroup
						onClick={expandLightGroup}
						name={group._data.name}
						roomType={group._data.class}
						deviceCount={group._data.lights.length}
						groupId={group._data.id}
						key={group._data.id}
						lights={group._data.lights}
						expanded={expandedGroup == group._data.id}
					/>
				))}
		</Section>
	);
};

export default LightGroupList;

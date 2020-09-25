import React, { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import Section from "./../Section/Section";

import backend from '../../config/axios.config';
import LightGroup from './LightGroup';

const LightGroupList = () => {
    const [groups, setGroups] = useState(null);
	const [expandedGroup, setExpandedGroup] = useState();

    const expandLightGroup = (id) => {
		if (expandedGroup === id) {
			setExpandedGroup(null);
		} else {
			setExpandedGroup(id);
        }
	};

    useEffect(() => {
        backend.get('/hue/groups/list')
            .then((response) => {
                setGroups(response.data);
            })
            .catch((error) => {
				console.error(error);
            })
    }, []);
    return (
		<>
			{groups && groups.length > 0 && (
				<Section title="Rooms">
					{
						groups.map((group) => (
							<LightGroup
								onClick={expandLightGroup}
								name={group._data.name}
								roomType={group._data.class}
								deviceCount={group._data.lights.length}
								groupId={group._data.id}
								key={group._data.id}
								lights={group._data.lights}
								expanded={
									expandedGroup == group._data.id
								}
							/>
						))
					}
				</Section>
			)}
		</>
	);
}

export default LightGroupList;
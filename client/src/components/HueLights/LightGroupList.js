import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import backend from '../../config/axios.config';
import LightGroup from './LightGroup';

const LightGroupList = (props) => {
    const [groups, setGroups] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        backend.get('/hue/groups/list')
            .then((response) => {
                setGroups(response.data);
                setConnected(true);
            })
            .catch((error) => {
                setConnected(false);
            })
    }, []);

    return (
        <>
            {
                connected && 
                <div className="light-group-list-container">
                    <Row>
                        {
                            connected && groups &&
                            groups.map((group) => (
                                <Col key={group._data.id} md={6}>
                                    <LightGroup 
                                        //onClick={() => toggleLightState(group._data.id, group._data.state.any_on)} 
                                        onClick={() => props.onSelectGroup(group._data.id)}
                                        name={group._data.name}
                                    />
                                </Col>
                            ))
                        }
                    </Row>
                </div>
            }
        </>
    );
}

export default LightGroupList;
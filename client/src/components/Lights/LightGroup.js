import React, { useState, useEffect } from 'react';
import './LightGroup.scss';
import {
    faBed,
    faCouch,
    faDoorOpen,
    faMoon,
    faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col } from 'react-bootstrap';
import Section from './../Section/Section';
import LoadingIndicator from './../LoadingIndicator';
import backend from '../../config/axios.config';

import Light from './Light';
import Scene from './Scene';

const LightGroup = (props) => {
    const [isLoading, setIsLoading] = useState(props.expanded);
    const [expandedGroupLights, setExpandedGroupLights] = useState([]);
    const [expandedGroupScenes, setExpandedGroupScenes] = useState([]);
    const [shouldFetchLights, setShouldFetchLights] = useState(props.expanded);

    const toggleLight = async (e, lightId) => {
        e.stopPropagation();
        setIsLoading(true);
        await backend.get(`/hue/lights/${lightId}/toggle`);
        setShouldFetchLights(!shouldFetchLights);
    };

    const activateScene = async (sceneId) => {
        setIsLoading(true);
        await backend.get(`/hue/scenes/${sceneId}/activate`);
        setShouldFetchLights(!shouldFetchLights);
    };

    const toggleFavoriteScene = async (sceneId) => {
        const newSceneState = expandedGroupScenes.map((scene) => {
            if (scene.id === sceneId) scene.favorite = !scene.favorite;

            return scene;
        });

        setExpandedGroupScenes(newSceneState);
    };

    useEffect(() => {
        if (!props.expanded) return;

        setIsLoading(true);
        backend
            .get(`/hue/lights/list?lightIds=${props.lights.join()}`)
            .then((response) => {
                setExpandedGroupLights(response.data);
                return backend.get(`/hue/groups/${props.groupId}/scenes`);
            })
            .then((response) => {
                setExpandedGroupScenes(response.data);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(true);
            });
    }, [props.expanded, shouldFetchLights]);

    const getRoomIcon = () => {
        switch (props.roomType) {
            case 'Bedroom':
                return <FontAwesomeIcon icon={faBed} />;
            case 'Living room':
                return <FontAwesomeIcon icon={faCouch} />;
            case 'Front door':
                return <FontAwesomeIcon icon={faDoorOpen} />;
            case 'Reading':
                return <FontAwesomeIcon icon={faMoon} />;
            default:
                return <FontAwesomeIcon icon={faLayerGroup} />;
        }
    };

    const Lights = () => {
        if (props.expanded && expandedGroupLights.length > 0) {
            return (
                <Section title="Lights" className="mb-3">
                    {expandedGroupLights.map((light) => (
                        <Col lg={3} xs={6} key={light._data.id}>
                            <Light
                                name={light._data.name}
                                currentLightState={light._data.state.on ? 'on' : 'off'}
                                bri={light._data.state.bri}
                                reachable={light._data.state.reachable}
                                id={light._data.id}
                                onToggleLight={toggleLight}
                            />
                        </Col>
                    ))}
                </Section>
            );
        } else {
            return '';
        }
    };

    const Scenes = () => {
        if (props.expanded && expandedGroupScenes.length > 0) {
            return (
                <Section title="Scenes">
                    {expandedGroupScenes.map((scene) => (
                        <Col lg={3} xs={6} key={scene.id}>
                            <Scene
                                id={scene.id}
                                name={scene.name}
                                favorite={scene.favorite}
                                onClick={activateScene}
                                onFavorite={toggleFavoriteScene}
                            />
                        </Col>
                    ))}
                </Section>
            );
        } else {
            return '';
        }
    };

    return (
        <Col
            xs={{
                span: props.expanded ? 12 : 6,
                order: props.expanded ? 'first' : '',
            }}
            lg={{
                span: props.expanded ? 12 : 4,
                order: props.expanded ? 'first' : '',
            }}
            className="mb-4"
            key={props.groupId}
        >
            <div className="light-group">
                <div
                    className={props.expanded ? 'group-details expanded' : 'group-details'}
                    onClick={() => props.onClick(props.groupId)}
                >
                    <span className="icon">{getRoomIcon()}</span>
                    <p className="name">{props.name}</p>
                    <p className="active-devices">{props.deviceCount} devices reachable.</p>
                </div>
                <Row className="mx-3">
                    <Col xs={12}>
                        {isLoading && props.expanded && <LoadingIndicator />}
                        {!isLoading && (
                            <>
                                <Lights />
                                <Scenes />
                            </>
                        )}
                    </Col>
                </Row>
            </div>
        </Col>
    );
};
export default LightGroup;

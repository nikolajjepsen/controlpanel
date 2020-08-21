import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import backend from '../../config/axios.config';
import { ButtonList, Button } from '../Button/Button';
import Scene from './Scene';
import Light from './Light';
import './SingleLightGroup.scss';


const SingleLightGroup = (props) => {
    const [currentLightGroup, setCurrentLightGroup] = useState();
    // shouldFetchGroup is used to tell if we should update the lights. 
    // we could mimic the icons on-click, but this keeps everything synced.
    // we do, however, send a request after every action. 
    // rate-limit is a concern.
    const [shouldFetchGroup, setShouldFetchGroup] = useState(true);
    const [isPerformingLightAction, setIsPerformingLightAction] = useState(false);
    
    const [currentGroupScenes, setCurrentGroupScenes] = useState([]);
    const [currentGroupLights, setCurrentGroupLights] = useState();


    // Todo: Sometimes it doesn't toggle??
    // Might be a rate-limit thing. 
    const toggleGroup = () => {
        let apiPath;
        if (currentLightGroup.state.any_on === false) {
            apiPath = `/hue/groups/${props.id}/state/on`;
        } else {
            apiPath = `/hue/groups/${props.id}/state/off`;
        }
        setIsPerformingLightAction('toggle_all');
        backend.get(apiPath)
            .then( async () => {
                setShouldFetchGroup(!shouldFetchGroup);
            });
    }

    const toggleLight = (lightId) => {
        backend.get(`/hue/lights/${lightId}/toggle`)
            .then(async () => {
                setShouldFetchGroup(!shouldFetchGroup);
            });
    }

    const activateScene = (sceneId) => {
        backend.get(`/hue/scenes/${sceneId}/activate`)
            .then(async () => {
                setShouldFetchGroup(!shouldFetchGroup);
            });
    }

    useEffect( () => {
        backend.get(`/hue/groups/${props.id}/scenes`)
            .then((response) => {
                setCurrentGroupScenes(response.data);
            });
    }, [props.id]);

    useEffect( () => {
        backend.get(`/hue/groups/get/${props.id}`)
            .then((response) => {
                setCurrentLightGroup(response.data._data);
                return backend.get(`/hue/lights/list?lightIds=${response.data._data.lights.join()}`);
            })
            .then((response) => {
                console.log(response.data);
                setCurrentGroupLights(response.data);
                setIsPerformingLightAction(false);
            })

    }, [props.id, shouldFetchGroup]);

    return (
            <div className="single-light-group">
                <div class="exit-single-group-container">
                <ButtonList listClass="button-list">
                        <Button
                            buttonClass="exit"
                            isActive={false}
                            isLoading={false}
                            icon={<svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0.4" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>}
                            onClick={
                                // On click set App.js state displayLightGroupId to null (none selected = widgets shows.)
                                () => props.onCancel(null)
                            }
                        />
                    </ButtonList>
                </div>
                {
                    currentLightGroup && 
                    <>
                        <h2 className="group-name">{currentLightGroup.name}</h2>
                        <ButtonList listClass="button-list">
                            <Button
                                buttonClass="power"
                                isActive={currentLightGroup.state.any_on}
                                isLoading={isPerformingLightAction === 'toggle_all'}
                                icon={<svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>}
                                onClick={() => toggleGroup()}
                            />
                        </ButtonList>                            
                        <Row className="lights-container">
                            <Col lg={12} className="mt-4">
                                <h3>Lights</h3>
                            </Col>
                            {currentGroupLights &&
                                currentGroupLights.map((light) => (
                                    <Col lg={4} md={4} sm={6} xs={6}>
                                        <Light 
                                            name={light._data.name} 
                                            currentLightState={light._data.state.on ? 'on' : 'off'}
                                            bri={light._data.state.bri}
                                            reachable={light._data.state.reachable}
                                            id={light._data.id}
                                            onClick={toggleLight}
                                        />
                                    </Col>
                                ))
                            }
                        </Row>
                        <Row className="scenes-container">
                            <Col lg={12} className="mt-4">
                                <h3>Scenes</h3>
                            </Col>
                            {currentGroupScenes &&
                                currentGroupScenes.map((scene) => (
                                    <Col lg={3} md={4} sm={4} xs={6}>
                                        <Scene 
                                            onClick={activateScene}
                                            name={scene._data.name} 
                                            id={scene._data.id} />
                                    </Col>
                                ))
                            }
                        </Row>
                    </>
                }
            </div>
    );

}

export default SingleLightGroup;
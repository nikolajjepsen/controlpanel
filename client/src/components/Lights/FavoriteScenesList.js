import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

import Scene from './Scene';
import Section from './../Section/Section';

import backend from '../../config/axios.config';
import LoadingIndicator from '../LoadingIndicator';

const FavoriteScenesList = () => {
    const [scenes, setScenes] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const activateScene = async (sceneId) => {
        await backend.get(`/hue/scenes/${sceneId}/activate`);
    };

    const toggleFavorite = (sceneId) => {
        scenes.filter((scene) => scene.id === sceneId);
    };

    useEffect(() => {
        setIsLoading(true);
        const fetch = async () => {
            try {
                const response = await backend.get('/hue/favorites/scenes');
                setScenes(response.data);
                setIsLoading(false);
            } catch (error) {
                // swallow the error
            }
        };

        fetch();
    }, []);

    return (
        <Section title="Favorite Scenes">
            {(isLoading || !scenes) && <LoadingIndicator />}
            {!isLoading &&
                scenes.map((scene) => (
                    <Col lg={4} xs={6} key={scene._data.id}>
                        <Scene
                            onClick={activateScene}
                            name={scene._data.name}
                            id={scene._data.id}
                            favorite={true}
                            onFavorite={toggleFavorite}
                        />
                    </Col>
                ))}
        </Section>
    );
};

export default FavoriteScenesList;

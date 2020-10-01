import React from 'react';

import { Heart, Power } from 'react-feather';
import backend from '../../config/axios.config';

import './Scene.scss';

const Scene = (props) => {
    const toggleFavorite = async (sceneId) => {
        await backend.post(`/hue/favorites/scenes`, {
            sceneId: sceneId,
        });
        props.onFavorite(sceneId);
    };

    return (
        <div className="scene mb-2">
            <div className="scene-details" onClick={() => props.onClick(props.id)}>
                <div className="activate-badge">
                    <Power />
                </div>
                <span className="name">{props.name}</span>
            </div>
            <div
                className={`icon-container ${props.favorite ? 'favorited' : ''}`}
                onClick={() => toggleFavorite(props.id)}
            >
                <Heart />
            </div>
        </div>
    );
};

export default Scene;

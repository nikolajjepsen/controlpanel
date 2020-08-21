import React from 'react';
import './Scene.scss';

const Scene = (props) => {
    
    return (
        <div className="scene" onClick={() => props.onClick(props.id)}>
            <span className="name">{props.name}</span>
        </div>
    )
}

export default Scene;
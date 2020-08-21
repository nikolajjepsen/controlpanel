import React from 'react';
import './LightGroup.scss';

const LightGroup = (props) => {

    return (
        <div className="light-group" onClick={props.onClick}>
            <p>{props.name}</p>
        </div>
    );
}

export default LightGroup;
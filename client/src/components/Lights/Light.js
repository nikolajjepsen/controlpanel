import React from 'react';
import './Light.scss';

// import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

const Light = (props) => {
	return (
		<div
			id={`light_${props.id}`}
			className={`light ${props.reachable ? '' : 'unreachable'} ${
				props.currentLightState === 'on' ? 'active' : ''
			}`}
			onClick={(e) => (props.reachable ? props.onClick(e, props.id) : false)}
		>
			<div className="light-state-badge">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="on">
					<path
						fill="currentColor"
						d="M320,64A112.14,112.14,0,0,0,208,176a16,16,0,0,0,32,0,80.09,80.09,0,0,1,80-80,16,16,0,0,0,0-32Zm0-64C217.06,0,143.88,83.55,144,176.23a175,175,0,0,0,43.56,115.55C213.22,321,237.84,368.69,240,384l.06,75.19a15.88,15.88,0,0,0,2.69,8.83l24.5,36.84A16,16,0,0,0,280.56,512h78.85a16,16,0,0,0,13.34-7.14L397.25,468a16.17,16.17,0,0,0,2.69-8.83L400,384c2.25-15.72,27-63.19,52.44-92.22A175.9,175.9,0,0,0,320,0Zm47.94,454.31L350.84,480H289.12l-17.06-25.69,0-6.31h95.91ZM368,416H272l-.06-32H368Zm60.41-145.31c-14,15.95-36.32,48.09-50.57,81.29H262.22c-14.28-33.21-36.6-65.34-50.6-81.29A143.47,143.47,0,0,1,176.06,176C175.88,99,236.44,32,320,32c79.41,0,144,64.59,144,144A143.69,143.69,0,0,1,428.38,270.69ZM96,176a16,16,0,0,0-16-16H16a16,16,0,0,0,0,32H80A16,16,0,0,0,96,176ZM528,64a16.17,16.17,0,0,0,7.16-1.69l64-32A16,16,0,0,0,584.84,1.69l-64,32A16,16,0,0,0,528,64Zm96,96H560a16,16,0,0,0,0,32h64a16,16,0,0,0,0-32ZM119.16,33.69l-64-32A16,16,0,0,0,40.84,30.31l64,32A16.17,16.17,0,0,0,112,64a16,16,0,0,0,7.16-30.31Zm480,288-64-32a16,16,0,0,0-14.32,28.63l64,32a16,16,0,0,0,14.32-28.63ZM112,288a16.17,16.17,0,0,0-7.16,1.69l-64,32a16,16,0,0,0,14.32,28.63l64-32A16,16,0,0,0,112,288Z"
					></path>
				</svg>
			</div>
			<div className={`light-details`}>
				<span className="name">{props.name}</span>
				{props.currentLightState === 'on' && (
					<span className="state">
						On at {Math.ceil((Number(props.bri) / 254) * 100)}%
					</span>
				)}
				{props.currentLightState === 'off' && props.reachable && (
					<span className="state">Off</span>
				)}
				{props.currentLightState === 'off' && !props.reachable && (
					<span className="state">Unreachable</span>
				)}
			</div>
			{props.currentLightState === 'on' && <div className="brightness-slider"></div>}
		</div>
	);
};
export default Light;

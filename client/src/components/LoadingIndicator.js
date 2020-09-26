import React from 'react';

import './LoadingIndicator.scss';

const LoadingIndicator = () => {
	return (
		<div className="lds-container">
			<div className="lds-ripple">
				<div></div>
				<div></div>
			</div>
		</div>
	);
};
export default LoadingIndicator;

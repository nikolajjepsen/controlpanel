import React from 'react';

import './LoadingIndicator.scss';

const LoadingIndicator = () => {
	return (
		<div class="lds-container">
			<div class="lds-ripple">
				<div></div>
				<div></div>
			</div>
		</div>
	);
};
export default LoadingIndicator;

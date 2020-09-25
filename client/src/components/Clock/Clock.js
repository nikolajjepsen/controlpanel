import React, { useState, useEffect } from 'react';
import './Clock.css';

const Clock = ({ withGreeting }) => {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [greeting, setGreeting] = useState(false);

	const welcomeName = 'Nikolaj';

	useEffect(() => {
		const greetings = [
			[23, 2, 'Good night'],
			[3, 6, 'Sleep well'],
			[7, 9, 'Good morning'],
			[10, 13, 'Hello'],
			[14, 17, 'Good afternoon'],
			[18, 22, 'Good evening'],
		];
		const currentHour = currentTime.getHours();
		greetings.forEach((greeting) => {
			if (currentHour >= greeting[0] && currentHour <= greeting[1]) {
				setGreeting(`${greeting[2]}, ${welcomeName}`);
			} else {
				return;
			}
		});

		let greetingInterval;
		// Set an interval to update tod every 10 seconds.
		greetingInterval = setInterval(() => {
			setCurrentTime(new Date());
		}, 10000);

		// clean up the interval on unmount.
		return () => {
			window.clearInterval(greetingInterval);
		};
	}, [currentTime]);

	// Alternative to formatTime would be to transform the date object toISOString and grab the last digits
	// as we do in the player component to show elapsed and total track length and progress.
	const formatTime = () => {
		return `${currentTime
			.getHours()
			.toString()
			.padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
	};
	return (
		<div className="greeting-container">
			<h1 className="digital-clock">{formatTime()}</h1>
			{greeting && withGreeting && <h2 className="greeting"> {greeting} </h2>}
		</div>
	);
};
export default Clock;

import React, { useState, useEffect, useCallback } from 'react';
import './Greeting.css';

const Greeting = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    const welcomeName = 'Nikolaj';
    // We use the hook, useCallback, to store the result if the current hour is the same
    // However, I'm not entirely sure this is the case, as we pass a different date object to the function
    // Should probably be checked.
    const determineGreeting = useCallback(() => {
        // Set the greeting based on time of day.
        // Which this could be boiled down, but a bunch of if-statements doesn't really look prettier.
        let greeting = '';
        switch (currentTime.getHours()) {
            case 0:
            case 1:
            case 2:
                greeting = `Good night, ${welcomeName}`;
                break;
            case 3:
            case 4:
            case 5:
                greeting = `Sleep well, ${welcomeName}`;
                break;
            case 6:
            case 7:
            case 8:
            case 9:
                greeting = `Good morning, ${welcomeName}`;
                break;
            case 10:
            case 11:
            case 12:
            case 13:
                greeting = `Hello, ${welcomeName}`;
                break;
            case 14:
            case 15:
            case 16:
            case 17:
                greeting = `Good afternoon, ${welcomeName}`;
                break;
            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
                greeting = `Good evening, ${welcomeName}`;
                break;
            default:
                greeting = `Hello, ${welcomeName}`;
        }
        return greeting;
    }, [currentTime]);
    const [greeting, setGreeting] = useState(determineGreeting());

    useEffect(() => {
        setGreeting(determineGreeting());

        let greetingInterval;
        // Set an interval to update tod every 10 seconds. 
        greetingInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 10000);

        // clean up the interval on unmount.
        return () => {
            window.clearInterval(greetingInterval);
        }
    }, [currentTime]);

    // Alternative to formatTime would be to transform the date object toISOString and grab the last digits
    // as we do in the player component to show elapsed and total track length and progress.
    const formatTime = () => {
        return `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
    }
    return (
        <div className="greeting-container">
            <h1 className="digital-clock">{formatTime()}</h1>
            <h2 className="greeting"> {greeting} </h2>
        </div>
    );
}
export default Greeting;
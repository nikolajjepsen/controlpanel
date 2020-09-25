import React, { useState, useEffect } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { ProgressBar } from 'react-bootstrap';

import backend from '../../config/axios.config';
import { ButtonList, Button } from '../Button/Button';
import './Player.scss';

const Player = () => {
    const [playerActive, setPlayerActive] = useState(false);
    const [currentTrack, setCurrentTrack] = useState('');
    const [currentlyPlaying, setCurrentlyPlaying] = useState(0);
    const [currentProgressMs, setCurrentProgressMs] = useState(0);
    const [isSpotifyControllable, setIsSpotifyControllable] = useState(false);
    const [isSonosControllable, setIsSonosControllable] = useState(false);
    const [sonosPlayerHost, setSonosPlayerHost] = useState(false);
    const [currentVolume, setCurrentVolume] = useState(0);
    const [updateVolume, setUpdateVolume] = useState(false);


    // TODO: 
    // Switch between Sonos device bugs
    // Pause when on Sonos device makes unable to control caused by @53 as we're not currently playing while paused.
    const getCurrent = async () => {
        backend.get(`/spotify/player/current`)
            .then((response) => {
                if (response.status === 200 && response.data.track) {
                    // Update the state based on the current track.
                    setPlayerActive(true);
                    setCurrentTrack(response.data);
                    setCurrentlyPlaying(response.data.currently_playing);
                    setCurrentProgressMs(response.data.progress_ms);
                    setCurrentVolume(response.data.device.volume);
                    // If the response data has a device ID we assume it's controllable by Spotify.
                    // Sonos devices does NOT have an ID.
                    if (response.data.device.id !== null) {
                        setIsSpotifyControllable(true);
                        setIsSonosControllable(false);
                    // If the device ID is null, we check if Sonos is currently playing.
                    } else {
                            backend.get(`/sonos/devices`)
                                .then((sonosDevicesResponse) => {
                                    if (sonosDevicesResponse.status === 200) {
                                        for (const deviceGroup of sonosDevicesResponse.data.groups) {
                                            // We loop through the devices (they get grouped by Sonos, even if they are a single device)
                                            if (deviceGroup.Name === response.data.device.name && response.data.device.is_active) {
                                                // If the Sonos group name is equal that of Spotify's device name and the device is active,
                                                // We make the player controllable by Sonos, and uncontrollable by Spotify.
                                                // Basically controls API endpoint is determined here as we base all conditionals around these states. 
                                                setIsSonosControllable(true);
                                                setSonosPlayerHost(deviceGroup.host);
                                                setIsSpotifyControllable(false);
                                            }
                                        }
                                    }
                                }).catch((err) => {
                                    setIsSpotifyControllable(false);
                                    setIsSonosControllable(false);
                                    console.log('Unable to fetch devices: ' + err);
                                }
                            );
                    }
                }
            }).catch((err) => {
                // throw Error('Unable to fetch current player', err.message);
            });
    }

    const handleSkip = async (direction) => {
        let apiUrl;
        if (isSpotifyControllable) {
            apiUrl = `/spotify/player/skip/${direction}`
        } else if(isSonosControllable) {
            apiUrl = `/sonos/player/${sonosPlayerHost}/skip/${direction}`
        } else {
            return;
        }

        backend.get(apiUrl)
            .then((response) => {
                if (response.status === 200) {
                    getCurrent();
                }
            });
    }

    const handlePlay = async() => {
        let apiUrl;
        if (isSpotifyControllable) {
            apiUrl = `/spotify/player/play?deviceId=${currentTrack.device.id}`
        } else if(isSonosControllable) {
            apiUrl = `/sonos/player/${sonosPlayerHost}/play`
        } else {
            return;
        }

        backend.get(apiUrl)
            .then((response) => {
                if (response.status === 200) {
                    setCurrentlyPlaying(true);
                }
            });
    }

    const handlePause = async() => {
        let apiUrl;
        if (isSpotifyControllable) {
            apiUrl = `/spotify/player/pause?deviceId=${currentTrack.device.id}`
        } else if (isSonosControllable) {
            apiUrl = `/sonos/player/${sonosPlayerHost}/pause`
        } else {
            return;
        }

        backend.get(apiUrl)
            .then((response) => {
                if (response.status === 200) {
                    setCurrentlyPlaying(false);
                }
            });
    }

    const handleSetVolume = async () => {
        let apiUrl;
        if (isSpotifyControllable) {
            apiUrl = `/spotify/player/setVolume/${currentVolume}?deviceId=${currentTrack.device.id}`
        } else if (isSonosControllable) {
            apiUrl = `/sonos/player/${sonosPlayerHost}/setVolume/${currentVolume}`
        } else {
            return;
        }
        backend.get(apiUrl)
            .then((response) => {
                if (response.status !== 200) {
                    console.log('Unable to set volume!')
                } else {
                    console.log('Volume set');
                }
            });
    }

    // Update the current track every 10 seconds
    // Could be more often, but it's fine. 
    // Maybe we could use a socket and simply listen on that.
    useEffect(() => {
        getCurrent();
        let playerIntervalId;
        if (playerActive) {
            playerIntervalId = setInterval(() => {
                getCurrent();
            }, 10000);
        }

        // Clean up the interval on unmount
        return () => {
            window.clearInterval(playerIntervalId);
        }
    }, [playerActive, currentTrack.track]);

    useEffect(() => {
        let progressIntervalId;
        if (playerActive && currentlyPlaying) {
            // If the progression in the track exceeds the total duration of the track
            if (currentProgressMs >= currentTrack.duration_ms) {
                // update the current track. We may be lucky to hit the API after the switch to next song.
                getCurrent();
                // And clean up the interval
                window.clearInterval(progressIntervalId);
                return;
            }
            // Update the progress every second. 
            // We moved the progress into state instead of calling the API every second.
            progressIntervalId = setInterval(() => {
                setCurrentProgressMs(currentProgressMs + 1000);
            }, 1000);
        }

        return () => {
            window.clearInterval(progressIntervalId);
        }
    });

    useEffect(() => {
        handleSetVolume();
    }, [updateVolume]);

    const getCurrentProgress = () => {
        if (currentProgressMs && currentTrack.duration_ms) {
            // Grab the minute and second digits by converting the progression and full duration in miliseconds into a date object
            let progressFormatted = new Date(currentProgressMs).toISOString().substr(14, 5);
            let durationFormatted = new Date(currentTrack.duration_ms).toISOString().substr(14, 5);
            let progressPercentage = ((currentProgressMs / currentTrack.duration_ms) * 100).toFixed(3);

            return (
                <div className="progress-container">
                    <span>{progressFormatted}</span>
                    <ProgressBar now={progressPercentage} />
                    <span>{durationFormatted}</span>
                </div>
            );
        } else {
            return '';
        }
    }

    const getVolumeIcon = () => {
        // Return a different SVG based on the current volume.
        if (currentVolume < 50 && currentVolume > 0) {
            return <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>;
        } else if (currentVolume >= 50) {
            return <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>;
        } else {
            return <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>;
        }

    }

    return (
        <>
            {
                playerActive && currentTrack &&
                <div className="player-container mb-4">
                    <div className="album-image">
                        <img src={currentTrack.album_image} alt={currentTrack.track} />
                    </div>

                    <span className="track">
                        { currentTrack.track }
                    </span>
                    <div className="artists">
                        {
                            // create a new array with the first 3 artists and then map them.
                            currentTrack.artists.slice(0, 2).map(artist => {
                                return <span className="artist" key={artist.name}>{artist.name}</span>
                            })
                        }
                    </div>
                    {getCurrentProgress()}
                    {(isSpotifyControllable || isSonosControllable) &&
                        <div className="controls">
                            <ButtonList listClass="player">
                                <Button
                                    buttonClass="player"
                                    buttonSize="small"
                                    isActive={false}
                                    isLoading={false}
                                    icon={<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>}
                                    onClick={() => handleSkip('previous')}
                                />
                                {
                                    !currentlyPlaying &&
                                    <Button
                                        buttonClass="player"
                                        buttonSize=""
                                        isActive={false}
                                        isLoading={false}
                                        icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="36" height="26">
                                                <path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6zm-16.2 55.1l-352 208C45.6 483.9 32 476.6 32 464V47.9c0-16.3 16.4-18.4 24.1-13.8l352 208.1c10.5 6.2 10.5 21.4.1 27.6z"></path>
                                            </svg>
                                        }
                                        onClick={() => handlePlay()}
                                    />
                                }
                                {
                                    currentlyPlaying &&
                                    <Button
                                        buttonClass="player"
                                        buttonSize=""
                                        isActive={false}
                                        isLoading={false}
                                        icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="30" height="26">
                                                <path fill="currentColor" d="M48 479h96c26.5 0 48-21.5 48-48V79c0-26.5-21.5-48-48-48H48C21.5 31 0 52.5 0 79v352c0 26.5 21.5 48 48 48zM32 79c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16v352c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V79zm272 400h96c26.5 0 48-21.5 48-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48zM288 79c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16v352c0 8.8-7.2 16-16 16h-96c-8.8 0-16-7.2-16-16V79z"></path>
                                            </svg>
                                        }
                                        onClick={() => handlePause()}
                                    />
                                }
                                <Button
                                    buttonClass="player"
                                    buttonSize="small"
                                    isActive={false}
                                    isLoading={false}
                                    icon={
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line>
                                        </svg>
                                    }
                                    onClick={() => handleSkip('next')}
                                />
                            </ButtonList>
                            {

                            <ButtonList listClass="player">
                                    <Button
                                        buttonClass="player"
                                        buttonSize="small"
                                        isActive={false}
                                        isLoading={false}
                                        icon={
                                            getVolumeIcon()
                                        }
                                        onClick={
                                            () => {
                                                setCurrentVolume(0);
                                            }
                                        }
                                    />
                                    <div className="volume-control">
                                        <RangeSlider
                                            value={currentVolume}
                                            onChange={event => setCurrentVolume(event.target.value)}
                                            onAfterChange={() => setUpdateVolume(!updateVolume)}
                                            tooltip="off"
                                        />
                                    </div>
                                </ButtonList>
                            }
                        </div>
                        }
                    <div className="current-device">
                        <span>
                            Listening on <strong>{currentTrack.device.name}</strong>
                        </span>
                    </div>
                </div>
            }
        </>
    );
}
export default Player;
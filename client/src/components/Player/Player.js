import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { Volume1, Volume2, VolumeX } from 'react-feather';

import PlayerLarge from './PlayerLarge';
import PlayerBar from './PlayerBar';
import backend from '../../config/axios.config';

import './Player.scss';

const Player = ({ size }) => {
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
        backend
            .get(`/spotify/player/current`)
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
                        backend
                            .get(`/sonos/devices`)
                            .then((sonosDevicesResponse) => {
                                if (sonosDevicesResponse.status === 200) {
                                    for (const deviceGroup of sonosDevicesResponse.data.groups) {
                                        // We loop through the devices (they get grouped by Sonos, even if they are a single device)
                                        if (
                                            deviceGroup.Name === response.data.device.name &&
                                            response.data.device.is_active
                                        ) {
                                            // If the Sonos group name is equal that of Spotify's device name and the device is active,
                                            // We make the player controllable by Sonos, and uncontrollable by Spotify.
                                            // Basically controls API endpoint is determined here as we base all conditionals around these states.
                                            setIsSonosControllable(true);
                                            setSonosPlayerHost(deviceGroup.host);
                                            setIsSpotifyControllable(false);
                                        }
                                    }
                                }
                            })
                            .catch((err) => {
                                setIsSpotifyControllable(false);
                                setIsSonosControllable(false);
                                console.log('Unable to fetch devices: ' + err);
                            });
                    }
                }
            })
            .catch((err) => {
                // throw Error('Unable to fetch current player', err.message);
            });
    };

    const handleSkip = async (direction) => {
        let apiUrl;
        if (isSpotifyControllable) {
            apiUrl = `/spotify/player/skip/${direction}`;
        } else if (isSonosControllable) {
            apiUrl = `/sonos/player/${sonosPlayerHost}/skip/${direction}`;
        } else {
            return;
        }

        backend.get(apiUrl).then((response) => {
            if (response.status === 200) {
                getCurrent();
            }
        });
    };

    const handlePlay = async () => {
        let apiUrl;
        if (isSpotifyControllable) {
            apiUrl = `/spotify/player/play?deviceId=${currentTrack.device.id}`;
        } else if (isSonosControllable) {
            apiUrl = `/sonos/player/${sonosPlayerHost}/play`;
        } else {
            return;
        }

        backend.get(apiUrl).then((response) => {
            if (response.status === 200) {
                setCurrentlyPlaying(true);
            }
        });
    };

    const handlePause = async () => {
        let apiUrl;
        if (isSpotifyControllable) {
            apiUrl = `/spotify/player/pause?deviceId=${currentTrack.device.id}`;
        } else if (isSonosControllable) {
            apiUrl = `/sonos/player/${sonosPlayerHost}/pause`;
        } else {
            return;
        }

        backend.get(apiUrl).then((response) => {
            if (response.status === 200) {
                setCurrentlyPlaying(false);
            }
        });
    };

    const handleSetVolume = async () => {
        let apiUrl;
        if (isSpotifyControllable) {
            apiUrl = `/spotify/player/setVolume/${currentVolume}?deviceId=${currentTrack.device.id}`;
        } else if (isSonosControllable) {
            apiUrl = `/sonos/player/${sonosPlayerHost}/setVolume/${currentVolume}`;
        } else {
            return;
        }
        backend.get(apiUrl).then((response) => {
            if (response.status === 200) {
                setUpdateVolume(false);
            }
        });
    };

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
        };
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
        };
    });

    useEffect(() => {
        handleSetVolume();
    }, [updateVolume]);

    const trackProgress = () => {
        if (currentProgressMs && currentTrack.duration_ms) {
            // Grab the minute and second digits by converting the progression and full duration in miliseconds into a date object
            let progressFormatted = new Date(currentProgressMs).toISOString().substr(14, 5);
            let durationFormatted = new Date(currentTrack.duration_ms).toISOString().substr(14, 5);
            let progressPercentage = ((currentProgressMs / currentTrack.duration_ms) * 100).toFixed(
                3,
            );
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
    };

    const getVolumeIcon = () => {
        // Return a different SVG based on the current volume.
        if (currentVolume < 50 && currentVolume > 0) {
            return <Volume1 size={16} />;
        } else if (currentVolume >= 50) {
            return <Volume2 size={16} />;
        } else {
            return <VolumeX size={16} />;
        }
    };

    if (size === 'small') {
        return (
            <PlayerBar
                className="mb-4"
                isControllable={isSonosControllable || isSpotifyControllable}
                isPlaying={currentlyPlaying}
                currentVolume={currentVolume}
                onSetVolume={setCurrentVolume}
                onUpdateVolume={setUpdateVolume}
                onSkip={handleSkip}
                onPlay={handlePlay}
                onPause={handlePause}
                currentTrack={currentTrack}
                progression={trackProgress()}
                volumeIcon={getVolumeIcon()}
            />
        );
    } else {
        return (
            <PlayerLarge
                className="mb-4"
                isControllable={isSonosControllable || isSpotifyControllable}
                isPlaying={currentlyPlaying}
                currentVolume={currentVolume}
                onSetVolume={setCurrentVolume}
                onUpdateVolume={setUpdateVolume}
                onSkip={handleSkip}
                onPlay={handlePlay}
                onPause={handlePause}
                currentTrack={currentTrack}
                progression={trackProgress()}
                volumeIcon={getVolumeIcon()}
            />
        );
    }
};
export default Player;

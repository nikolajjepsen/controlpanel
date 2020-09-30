import React from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { Play, Pause, SkipBack, SkipForward } from 'react-feather';
import { ButtonList, Button } from '../Button/Button';

import './Player.scss';

const PlayerLarge = ({
	isControllable,
	isPlaying,
	currentTrack,
	currentVolume,
	progression,
	...props
}) => {
	console.log(progression);
	return (
		<>
			{currentTrack && (
				<div className={`player-container mini-player ${props.className}`}>
					<div className="meta-content">
						<div className="album-image">
							<img src={currentTrack.album_image} alt={currentTrack.track} />
						</div>
						<div className="track-details">
							<span className="track">{currentTrack.track}</span>
							<div className="artists">
								{
									// create a new array with the first 3 artists and then map them.
									currentTrack.artists.slice(0, 2).map((artist) => {
										return (
											<span className="artist" key={artist.name}>
												{artist.name}
											</span>
										);
									})
								}
							</div>
						</div>
					</div>
					<div className="track-progression">
						<div className="progression">{progression}</div>
						{isControllable && (
							<div className="controls">
								<ButtonList className="player">
									<Button
										buttonClass="skip-backwards"
										buttonSize="small"
										isActive={false}
										isLoading={false}
										icon={<SkipBack size={16} />}
										onClick={() => props.onSkip('previous')}
									/>
									{!isPlaying && (
										<Button
											buttonClass="play"
											buttonSize=""
											isActive={false}
											isLoading={false}
											icon={<Play size={29} strokeWidth="1.2" />}
											onClick={() => props.onPlay()}
										/>
									)}
									{isPlaying && (
										<Button
											buttonClass="pause"
											buttonSize=""
											isActive={false}
											isLoading={false}
											icon={<Pause size={29} strokeWidth="1.2" />}
											onClick={() => props.onPause()}
										/>
									)}
									<Button
										buttonClass="skip-forward"
										buttonSize="small"
										isActive={false}
										isLoading={false}
										icon={<SkipForward size={16} />}
										onClick={() => props.onSkip('next')}
									/>
								</ButtonList>
								{
									<ButtonList className="volume">
										<Button
											buttonClass="mute"
											buttonSize="small"
											isActive={false}
											isLoading={false}
											icon={props.volumeIcon}
											onClick={() => {
												props.onSetVolume(0);
											}}
										/>
										<div className="volume-control">
											<RangeSlider
												value={currentVolume}
												onChange={(event) =>
													props.onSetVolume(event.target.value)
												}
												onAfterChange={() => props.onUpdateVolume(true)}
												tooltip="off"
											/>
										</div>
									</ButtonList>
								}
							</div>
						)}
					</div>
					<div className="current-device">
						<span>
							Listening on <strong>{currentTrack.device.name}</strong>
						</span>
					</div>
				</div>
			)}
		</>
	);
};

export default PlayerLarge;

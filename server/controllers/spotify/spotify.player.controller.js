const fs = require('fs');
const { spotify, setLoginCredentials } = require('./spotify.auth.controller');

/*
    Finds the current playing track.
    Returns an object with the data, including which device it's playing on.
    For some reason, Spotify API doesn't allow you to control music playing on
    e.g. Sonos. Should be handled separately.
*/
const getCurrentlyPlaying = (req, res) => {
    // Grab our auth tokens from local file
    const token = fs.readFileSync('./stoken.json', 'utf-8');
    const jsonToken = JSON.parse(token);
    // Set the refresh token
    spotify.setRefreshToken(jsonToken.refresh_token);
    // and constantly refresh the access token.
    // (should probably be changed to keep an access token for x amount of time, and then refresh it if it's expired.)
    spotify.refreshAccessToken().then((data) => {
        spotify.setAccessToken(data.body.access_token);

        spotify.getMyCurrentPlaybackState()
            .then((data) => {
                if (data.statusCode === 200) {
                    let albumImage;
                    // Grab our album data; we just need a small image and 300x300 seems to be a standard image
                    if (data.body.item.album.images) {
                        albumImage = data.body.item.album.images[1]; // should most likely be 300x300
                    }
                    // return an object with the data of the current track.
                    res.send({
                        track: data.body.item.name,
                        artists: data.body.item.artists,
                        album_image: albumImage.url,
                        duration_ms: data.body.item.duration_ms,
                        progress_ms: data.body.progress_ms || 0,
                        device: {
                            name: data.body.device.name,
                            id: data.body.device.id,
                            volume: data.body.device.volume_percent,
                            is_active: data.body.device.is_active
                        },
                        currently_playing: data.body.is_playing,
                    });
                } else if(data.statusCode === 204) {
                    res.send({
                        message: 'Currently no playback',
                        data: data
                    });
                } else {
                    res.send({
                        message: 'Unable to determine playback status with code: ' + data.statusCode
                    });
                }
            })
            .catch((err) =>
                console.log('Error fetching playback data: ', err.message)
            )
    })
    .catch((err) => console.log('Unable to refresh token: ', err.message));
}

const play = (req, res) => {
    const _deviceId = req.query.deviceId;
    const token = fs.readFileSync('./stoken.json', 'utf-8');
    const jsonToken = JSON.parse(token);
    spotify.setRefreshToken(jsonToken.refresh_token);

    spotify.refreshAccessToken().then((data) => {
        spotify.setAccessToken(data.body.access_token);
        // Device_id would allow control of external devices, but since we're using Sonos, we can't control them.
        // Howoever, it should work with bluetooth speakers etc.
        spotify.play({
            device_id: _deviceId
        }).then(() => {
            res.send({
                message: 'Playback continued'
            });
        }).catch((err) =>
            res.send({
                message: 'Unable to resume playback:' + err.message
            })
        )
    });
}

const pause = (req, res) => {
    const _deviceId = req.query.deviceId;
    const token = fs.readFileSync('./stoken.json', 'utf-8');
    const jsonToken = JSON.parse(token);
    spotify.setRefreshToken(jsonToken.refresh_token);

    spotify.refreshAccessToken().then((data) => {
        spotify.setAccessToken(data.body.access_token);
        spotify.pause({
            device_id: _deviceId
        }).then(() => {
            res.send({
                message: 'Playback paused'
            });
        }).catch((err) =>
            res.status(500).send({
                message: 'Unable to pause playback:' + err.message
            })
        )
    });
}

/*
    Skips track in either next or previous.
*/
const skip = (req, res) => {
    const direction = req.params.direction;

    const token = fs.readFileSync('./stoken.json', 'utf-8');
    const jsonToken = JSON.parse(token);
    spotify.setRefreshToken(jsonToken.refresh_token);

    // We're sending the desired direction of the skip in the browser.
    if (direction == 'next') {
        spotify.refreshAccessToken().then((data) => {
            spotify.setAccessToken(data.body.access_token);
            spotify.skipToNext()
            .then(() => {
                res.send({
                    message: 'Skipped to next song'
                });
            }).catch((err) => {
                console.log(err)
                res.status(500).send({
                    message: 'Unable to skip to next song:' + err.message
                })
            })
        });
    } else if (direction == 'previous') {
        spotify.refreshAccessToken().then((data) => {
            spotify.setAccessToken(data.body.access_token);
            spotify.skipToPrevious()
            .then(() => {
                res.send({
                    message: 'Skipped to previous song'
                });
            }).catch((err) =>
                res.status(500).send({
                    message: 'Unable to skip to next song:' + err.message
                })
            )
        });
    } else {
        res.send('Invalid direction.');
    }
}

/*
    Sets the volume of playback.
*/
const setVolume = (req, res) => {
    const _deviceId = req.query.deviceId;
    const volumePercentage = req.params.volume;
    console.log('Setting volume');
    const token = fs.readFileSync('./stoken.json', 'utf-8');
    const jsonToken = JSON.parse(token);
    spotify.setRefreshToken(jsonToken.refresh_token);

    spotify.refreshAccessToken().then((data) => {
        spotify.setAccessToken(data.body.access_token);
        spotify.setVolume(volumePercentage)
            .then((data) => {
                res.send({
                    message: 'Volume set to: ' + volumePercentage
                });
            }).catch((err) =>
                res.status(500).send({
                    message: 'Unable to set volume:' + err
                })
            )
    });
}
/*
    Grabs the current available devices.
*/
const devices = (req, res) => {
    const token = fs.readFileSync('./stoken.json', 'utf-8');
    const jsonToken = JSON.parse(token);

    spotify.setRefreshToken(jsonToken.refresh_token);
    spotify.refreshAccessToken().then((data) => {
        spotify.setAccessToken(data.body.access_token);
        spotify.getMyDevices()
            .then((response) => {
                res.send(response);
            }).catch((err) =>
                res.status(500).send({
                    message: 'Unable to fetch devices:' + err.message
                })
            )
    });
}

module.exports = {
    getCurrentlyPlaying,
    play,
    pause,
    skip,
    devices,
    setVolume
};
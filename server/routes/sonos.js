const express = require('express');
const router = express.Router();
const {
    getDevices,
    getCurrentState,
    play,
    pause,
    skip,
    setVolume,
    getSpotifyConnect,
} = require('../controllers/sonos/sonos.player.controller');


router.route('/devices').get(getDevices);
router.route('/player/:ip/currentState').get(getCurrentState);
router.route('/player/:ip/play').get(play);
router.route('/player/:ip/pause').get(pause);
router.route('/player/:ip/skip/:direction').get(skip);
router.route('/player/:ip/setVolume/:volume').get(setVolume);
router.route('/player/:ip/spotifyInfo').get(getSpotifyConnect);

module.exports = router;
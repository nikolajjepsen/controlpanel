const express = require('express');
const router = express.Router();
const {
	getCurrentlyPlaying,
	play,
	pause,
	devices,
	setVolume,
	skip,
} = require('../controllers/spotify/spotify.player.controller');

const { authorize, storeToken } = require('../controllers/spotify/spotify.auth.controller');

router.route('/authorize').get(authorize);
router.route('/hello').get((req, res) => {
	console.log('HEYA');
	res.send('Hello!');
});
router.route('/callback').get(storeToken);

router.route('/devices').get(devices);
router.route('/player/current').get(getCurrentlyPlaying);
router.route('/player/play').get(play);
router.route('/player/pause').get(pause);
router.route('/player/skip/:direction').get(skip);
router.route('/player/setVolume/:volume').get(setVolume);

module.exports = router;

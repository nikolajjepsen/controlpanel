const express = require('express');
const router = express.Router();
const {
	setup,
	listLights,
	toggleSingleLight,
	listGroups,
	getGroup,
	getGroupScenes,
	toggleGroupActiveState,
	activateScene,
	listFavoriteScenes,
	toggleFavoriteScene,
} = require('../controllers/hue/hue.controller');

router.route('/setup').get(setup);
router.route('/lights/list').get(listLights);
router.route('/lights/:lightId/toggle').get(toggleSingleLight);
router.route('/groups/list').get(listGroups);
router.route('/groups/:groupId').get(getGroup);
router.route('/groups/:groupId/scenes').get(getGroupScenes);
router.route('/groups/:groupId/state/:groupState').get(toggleGroupActiveState);
router.route('/scenes/:sceneId/activate').get(activateScene);
router.route('/favorites/scenes').get(listFavoriteScenes);
router.route('/favorites/scenes').post(toggleFavoriteScene);

module.exports = router;

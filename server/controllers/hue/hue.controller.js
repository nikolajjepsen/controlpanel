const fs = require('fs');
const path = require('path');
const hue = require('node-hue-api').v3;

const FavoriteScene = require('./../../models/favorite-scenes.model.js');

getConfig = () => {
	const relativePathToConfig = path.join(__dirname, 'hue.config.json');
	let config;
	try {
		config = fs.readFileSync(relativePathToConfig, 'utf8');
	} catch (err) {
		console.log('Unable to reach config file', err.message);
	}
	return JSON.parse(config);
};

saveConfig = (config) => {
	const relativePathToConfig = path.join(__dirname, 'hue.config.json');
	try {
		fs.writeFileSync(relativePathToConfig, config, 'utf8');
		console.log('Updated config');
		return true;
	} catch (err) {
		console.log('Unable to write to config file', err.message);
	}

	return false;
};

/* Press the link button on the physical bridge before running this, 30 sec timer */
const setup = async () => {
	const ipAddress = await discoverBridge();

	// Create an unauthenticated instance of the Hue API so that we can create a new user
	const unauthenticatedApi = await hue.api.createLocal(ipAddress).connect();

	let createdUser;
	try {
		createdUser = await unauthenticatedApi.users.createUser('new-tab', 'desktop-dlc');
		console.log(
			'*******************************************************************************\n',
		);
		console.log(`Hue Bridge User: ${createdUser.username}`);
		console.log(`Hue Bridge User Client Key: ${createdUser.clientkey}`);
		console.log(
			'*******************************************************************************\n',
		);

		// Create a new API instance that is authenticated with the new user we created
		const authenticatedApi = await hue.api.createLocal(ipAddress).connect(createdUser.username);

		// Do something with the authenticated user/api
		const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
		console.log(`Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);
	} catch (err) {
		console.error(`Unexpected Error: ${err.message}`);
	}
};

const discoverBridge = async () => {
	try {
		let results = await hue.discovery.nupnpSearch();
		const availableBridges = results.filter((bridge) => !bridge.error);
		if (availableBridges === 0) {
			console.log('no bridges available');
			return;
		} else {
			return availableBridges[0].ipaddress;
		}
	} catch (err) {
		console.log(err);
	}
};

const connectLocally = async () => {
	console.time();
	const config = getConfig();
	if (config.ip) {
		try {
			const api = await hue.api.createLocal(config.ip).connect(config.username);
			console.timeEnd();
			return api;
		} catch (err) {
			console.log('Cached IP is no longer valid. Discovering bridges ...');
		}
	}

	// if we were unable to connect using the stored IP, fetch a new one.
	const ip = await discoverBridge();
	if (!ip) {
		console.log('No bridges found on network.');
		return next(new Error('Unable to connect locally: no bridge found on network.'));
	}

	// update the config
	config.ip = ip;
	saveConfig(JSON.stringify(config));
	return await hue.api.createLocal(ip).connect(config.username);
};

const listLights = async (req, res, next) => {
	let lightsArray = [];
	if (req.query.lightIds) {
		lightsArray = req.query.lightIds.split(',');
	}

	const authenticatedApi = await connectLocally();
	let lights = await authenticatedApi.lights.getAll();

	if (lightsArray.length > 0) {
		// filter the lights; keep all needed
		lights = lights.filter((light) => lightsArray.includes(light._data.id.toString()));
	}

	// remove unneeded properties
	lights.forEach((group) => {
		delete group._attributes;
		delete group._populationData;
	});
	res.send(lights);
};

const getLightState = async (lightId) => {
	const connectedApi = await connectLocally();
	try {
		return await connectedApi.lights.getLightState(lightId);
	} catch (err) {
		return false;
	}
};

const toggleSingleLight = async (req, res, next) => {
	const connectedApi = await connectLocally();
	const lightState = await getLightState(req.params.lightId);

	if (lightState) {
		try {
			connectedApi.lights.setLightState(req.params.lightId, { on: !lightState.on });

			res.send({
				message: 'Light has been toggled',
			});
		} catch (err) {
			next(err);
		}
	} else {
		next(new Error('Unable to get current lightstate.'));
	}
};

const listGroups = async (req, res, next) => {
	const connectedApi = await connectLocally();
	try {
		let groups = await connectedApi.groups.getAll();
		if (groups.length == 0) return res.status(404).send({ message: 'Not groups found.' });

		// filter everything not either a zone or a group
		groups = groups.filter((group) => group._data.type == 'Room' || group._data.type == 'Zone');

		// and remove the properties we dont need for simplicity
		groups.forEach((group) => {
			delete group._attributes;
			delete group._populationData;
		});
		res.send(groups);
	} catch (err) {
		next(err);
	}
};

const toggleGroupActiveState = async (req, res, next) => {
	const connectedApi = await connectLocally();

	let groupState;
	// create a new lightstate we can pass to setGroupState
	if (req.params.groupState == 'off') {
		groupState = new hue.lightStates.GroupLightState().off();
	} else {
		groupState = new hue.lightStates.GroupLightState().on();
	}

	try {
		connectedApi.groups.setGroupState(req.params.groupId, groupState);
		res.send({
			message: 'Turned ' + req.params.groupState + ' group: ' + req.params.groupId,
		});
	} catch (err) {
		next(err);
	}
};

const getGroup = async (req, res, next) => {
	const connectedApi = await connectLocally();
	let group = connectedApi.groups.getGroup(req.params.groupId);
	delete group._attributes;
	delete group._populationData;
	res.send(group);
};

const getGroupScenes = async (req, res, next) => {
	const connectedApi = await connectLocally();
	let scenes = await connectedApi.scenes.getAll();
	// first filter the scenes to remove all the scenes attached to another group than what's needed
	let groupScenes = scenes.filter((scene) => scene._data.group == req.params.groupId);
	// then remove the scenes where their name include 'storage' as they don't seem to change anything?
	groupScenes = groupScenes.filter((scene) => !scene._data.name.includes('storage'));

	groupScenes = await Promise.all(
		groupScenes.map(async (scene) => {
			delete scene._attributes;
			delete scene._populationData;
			let data = scene._data;
			try {
				const result = await FavoriteScene.exists({ sceneId: data.id });
				return Object.assign(data, { favorite: result });
			} catch (error) {
				console.log(error);
			}
		}),
	).catch((err) => {
		return next(err);
	});
	res.send(groupScenes);
};

const getScene = async (sceneId) => {
	const connectedApi = await connectLocally();
	return await connectedApi.scenes.getScene(sceneId);
};

const activateScene = async (req, res, next) => {
	const connectedApi = await connectLocally();
	try {
		await connectedApi.scenes.activateScene(req.params.sceneId);
		return res.send({
			message: `Scene #${req.params.sceneId} activated`,
		});
	} catch (err) {
		next(err);
	}
};

const listFavoriteScenes = async (req, res, next) => {
	let favorites;
	try {
		favorites = await FavoriteScene.find();
	} catch (error) {
		next(new Error('Unable to fetch favorite scenes: ' + JSON.stringify(error)));
	}

	if (favorites.length == 0) {
		return res.status(404).json([]);
	}
	try {
		const scenes = await Promise.all(favorites.map((favorite) => getScene(favorite.sceneId)));
		res.json(scenes);
	} catch (error) {
		next(error);
	}
};

const toggleFavoriteScene = async (req, res, next) => {
	if (!req.body.sceneId) {
		return next(new Error('Please include a scene ID'));
	}
	const foundFavoriteScene = await FavoriteScene.find({ sceneId: req.body.sceneId });

	if (foundFavoriteScene.length > 0) {
		try {
			await FavoriteScene.deleteOne({ sceneId: req.body.sceneId });
			return res.json({
				message: 'Favorite scene toggled off',
			});
		} catch (error) {
			return res.json({
				message: 'Unable to toggle scene off.',
			});
		}
	}

	const scene = new FavoriteScene({
		sceneId: req.body.sceneId,
	});
	scene
		.save()
		.then((createdScene) => {
			res.status(201).json({
				message: 'Favorite scene toggled on.',
				insertedObject: createdScene,
			});
		})
		.catch((err) => {
			next(new Error('Unable to save new favorite scene.' + JSON.stringify(err)));
		});
};

module.exports = {
	setup,
	listGroups,
	getGroup,
	getGroupScenes,
	activateScene,
	toggleGroupActiveState,
	listLights,
	toggleSingleLight,
	listFavoriteScenes,
	toggleFavoriteScene,
};

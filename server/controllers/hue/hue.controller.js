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

const discoverBridge = async () => {
	const discoveryResults = await hue.discovery.nupnpSearch();
	// if not on same network as a hue bridge the array would be empty.
	if (discoveryResults.length === 0) {
		console.error('Failed to resolve any Hue Bridges');
		return null;
	} else {
		// return first result
		return discoveryResults[0].ipaddress;
	}
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

const listLights = async (req, res, next) => {
	const config = getConfig();
	const ip = await discoverBridge();
	let lightsArray = [];

	if (req.query.lightIds) {
		lightsArray = req.query.lightIds.split(',');
	}

	if (!ip) {
		return next(new Error('Unable to find Hue Bridge IP'));
	}

	hue.api
		.createLocal(ip)
		.connect(config.username)
		.then((api) => {
			return api.lights.getAll();
		})
		.then((lights) => {
			// if we found any lights
			// we're grabbing all of them to avoid the rate limiting.
			if (lightsArray.length > 0) {
				// filter the lights; keep all needed
				filteredLights = lights.filter((light) =>
					lightsArray.includes(light._data.id.toString()),
				);
			} else {
				filteredLights = lights;
			}

			// remove unneeded properties
			filteredLights.forEach((group) => {
				delete group._attributes;
				delete group._populationData;
			});
			res.send(filteredLights);
		});
};

const getLightState = async (lightId) => {
	const config = getConfig();
	const ip = await discoverBridge();
	return new Promise((resolve, reject) => {
		hue.api
			.createLocal(ip)
			.connect(config.username)
			.then((api) => {
				return api.lights.getLightState(lightId);
			})
			.then((lightState) => {
				resolve(lightState);
			})
			.catch((err) => {
				reject(err.message);
			});
	});
};

const toggleSingleLight = async (req, res, next) => {
	const config = getConfig();
	const ip = await discoverBridge();

	if (!ip) {
		return next(new Error('Unable to find Hue Bridge IP'));
	}

	const lightState = await getLightState(req.params.lightId);
	hue.api
		.createLocal(ip)
		.connect(config.username)
		.then((api) => {
			// set the current light state on light to the opposite of the current state
			return api.lights.setLightState(req.params.lightId, { on: !lightState.on });
		})
		.then(() => {
			res.send({
				message: 'Light has been toggled',
			});
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error toggling lightstate.',
				error_message: err.message,
			});
		});
};

const listGroups = async (req, res, next) => {
	const config = getConfig();
	const ip = await discoverBridge();

	if (!ip) {
		return next(new Error('Unable to find Hue Bridge IP'));
	}

	hue.api
		.createLocal(ip)
		.connect(config.username)
		.then((api) => {
			return api.groups.getAll();
		})
		.then((groups) => {
			// grab all groups either room or zone
			// own setup had a bunch of different filler groups from multiple different apps
			filteredGroups = groups.filter(
				(group) => group._data.type == 'Room' || group._data.type == 'Zone',
			);

			// and remove the properties we dont need for simplicity
			filteredGroups.forEach((group) => {
				delete group._attributes;
				delete group._populationData;
			});
			res.send(filteredGroups);
		})
		.catch((err) => {
			next(err);
		});
};

const toggleGroupActiveState = async (req, res, next) => {
	const config = getConfig();
	const ip = await discoverBridge();

	if (!ip) {
		return next(new Error('Unable to find Hue Bridge IP'));
	}

	hue.api
		.createLocal(ip)
		.connect(config.username)
		.then((api) => {
			let groupState;
			// create a new lightstate we can pass to setGroupState
			if (req.params.groupState == 'off') {
				groupState = new hue.lightStates.GroupLightState().off();
			} else {
				groupState = new hue.lightStates.GroupLightState().on();
			}
			return api.groups.setGroupState(req.params.groupId, groupState);
		})
		.then(() => {
			res.send({
				message: 'Turned ' + req.params.groupState + ' group: ' + req.params.groupId,
			});
		});
};

const getGroup = async (req, res, next) => {
	const config = getConfig();
	const ip = await discoverBridge();

	if (!ip) {
		return next(new Error('Unable to find Hue Bridge IP'));
	}

	hue.api
		.createLocal(ip)
		.connect(config.username)
		.then((api) => {
			return api.groups.getGroup(req.params.groupId);
		})
		.then((group) => {
			delete group._attributes;
			delete group._populationData;
			res.send(group);
		});
};

const getGroupScenes = async (req, res, next) => {
	const config = getConfig();
	const ip = await discoverBridge();

	if (!ip) {
		return next(new Error('Unable to find Hue Bridge IP'));
	}

	hue.api
		.createLocal(ip)
		.connect(config.username)
		.then((api) => {
			return api.scenes.getAll();
		})
		.then(async (scenes) => {
			// first filter the scenes to remove all the scenes attached to another group than what's needed
			let groupScenes = scenes.filter((scene) => scene._data.group == req.params.groupId);
			// then remove the scenes where their name include 'storage' as they don't seem to change anything?
			groupScenes = groupScenes.filter((scene) => !scene._data.name.includes('storage'));

			groupScenes = await Promise.all(
				groupScenes.map(async (scene) => {
					delete scene._attributes;
					delete scene._populationData;
					let data = scene._data;
					const result = await FavoriteScene.exists({ sceneId: data.id });
					return Object.assign(data, { favorite: result });
				}),
			);
			res.send(groupScenes);
		});
};

const getScene = async (sceneId) => {
	const config = getConfig();
	const ip = await discoverBridge();

	if (!ip) {
		return next(new Error('Unable to find Hue Bridge IP'));
	}

	const api = await hue.api.createLocal(ip).connect(config.username);
	return api.scenes.getScene(sceneId);
};

const activateScene = async (req, res, next) => {
	const config = getConfig();
	const ip = await discoverBridge();

	if (!ip) {
		return next(new Error('Unable to find Hue Bridge IP'));
	}

	hue.api
		.createLocal(ip)
		.connect(config.username)
		.then((api) => {
			return api.scenes.activateScene(req.params.sceneId);
		})
		.then(() => {
			res.json({
				message: 'activated scene.',
			});
		});
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

	const scenes = await Promise.all(favorites.map((favorite) => getScene(favorite.sceneId)));

	res.json(scenes);
};

const toggleFavoriteScene = async (req, res, next) => {
	if (!req.body.sceneId) {
		return next(new Error('Please include a scene ID'));
	}
	const foundFavoriteScene = await FavoriteScene.find({ sceneId: req.body.sceneId });
	console.log(foundFavoriteScene);
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

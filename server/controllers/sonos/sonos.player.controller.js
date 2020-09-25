/*
Does not require auth as we're controlling directly from network
*/

const { Sonos } = require('sonos');
const DeviceDiscovery = require('sonos').AsyncDeviceDiscovery;

// event on all found...
const getDevices = (req, res) => {
	const discovery = new DeviceDiscovery();
	discovery
		.discover()
		.then((device) => {
			sonos = new Sonos(device.host);
			sonos.getAllGroups().then((groups) => {
				res.send({
					groups,
				});
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(404).send({
				message: 'Unable to find Sonos device',
			});
		});
};

const getCurrentState = (req, res) => {
	const device = new Sonos(req.params.ip);
	device.getCurrentState().then((currentState) => {
		res.send({
			status: currentState,
			host: req.params.ip,
		});
	});
};

const getSpotifyConnect = (req, res) => {
	const device = new Sonos(req.params.ip);
	device.getSpotifyConnectInfo().then((currentState) => {
		res.send({
			status: currentState,
			host: req.params.ip,
		});
	});
};

const pause = (req, res) => {
	const device = new Sonos(req.params.ip);
	device.pause().then((currentState) => {
		res.send({
			status: currentState,
			host: req.params.ip,
		});
	});
};

const play = (req, res) => {
	const device = new Sonos(req.params.ip);
	device.play().then((currentState) => {
		res.send({
			status: currentState,
			host: req.params.ip,
		});
	});
};

const skip = (req, res) => {
	const device = new Sonos(req.params.ip);

	// We're sending the direction we wish to skip in the URL.
	if (req.params.direction == 'next') {
		device.next().then((change) => {
			res.send({
				status: change,
				host: req.params.ip,
				direction: req.params.direction,
			});
		});
	} else if (req.params.direction == 'previous') {
		device.previous().then((change) => {
			res.send({
				status: change,
				host: req.params.ip,
				direction: req.params.direction,
			});
		});
	} else {
		req.send({
			message: 'invalid direction',
		});
	}
};

const setVolume = (req, res) => {
	const device = new Sonos(req.params.ip);
	const volume = req.params.volume;

	// We should probably check whether or not the value is integer deeper, but for new it's fine.
	if (Number.isInteger(parseInt(volume))) {
		device.setVolume(volume).then((change) => {
			res.send({
				status: change,
				host: req.params.ip,
			});
		});
	} else {
		// Send unprocessable entity code
		res.status(422).send({
			message: 'Volume must be of type integer.',
		});
	}
};

module.exports = {
	getDevices,
	getCurrentState,
	pause,
	play,
	skip,
	setVolume,
	getSpotifyConnect,
};

/*
// find one device
DeviceDiscovery().once('DeviceAvailable', (device) => {
    console.log('found device at ' + device.host)

    // get all groups
    sonos = new Sonos(device.host)
    sonos.getAllGroups().then(groups => {
        groups.forEach(group => {
            console.log(group.Name);
        })
    })
})*/

require('dotenv').config()

const express = require('express');
const app = express()

const https = require('https')
const fs = require('fs');

const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection to MongoDB established')
}).catch(err => {
    console.error('Unable to connect to MongoDB. Exiting ...', err);
    process.exit(1);
})

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));


const auth = require('./app/controllers/storedAuth.controller');
app.get('/auth/getCurrent', auth.getCurrent);

const spotifyAuth = require('./app/controllers/spotify/spotify.auth.controller');
app.get('/spotify/authorize', spotifyAuth.authorize);
app.get('/spotify/callback', spotifyAuth.storeToken);

const spotifyPlayer = require('./app/controllers/spotify/spotify.player.controller');
app.get('/spotify/player/current', spotifyPlayer.getCurrentlyPlaying);
app.get('/spotify/player/play', spotifyPlayer.play);
app.get('/spotify/player/pause', spotifyPlayer.pause);
app.get('/spotify/player/devices', spotifyPlayer.devices);
app.get('/spotify/player/setVolume/:volume', spotifyPlayer.setVolume);
app.get('/spotify/player/skip/:direction', spotifyPlayer.skip);

const sonos = require('./app/controllers/sonos/sonos.player.controller');
app.get('/sonos/devices/getAll', sonos.getDevices);
app.get('/sonos/player/:ip/currentState', sonos.getCurrentState);
app.get('/sonos/player/:ip/play', sonos.play);
app.get('/sonos/player/:ip/pause', sonos.pause);
app.get('/sonos/player/:ip/skip/:direction', sonos.skip);
app.get('/sonos/player/:ip/setVolume/:volume', sonos.setVolume);
app.get('/sonos/player/:ip/spotifyInfo', sonos.getSpotifyConnect);

const hue = require('./app/controllers/hue/hue.controller');
app.get('/hue/setup', hue.setup);
app.get('/hue/lights/list', hue.listLights);
app.get('/hue/lights/:lightId/toggle', hue.toggleSingleLight);
app.get('/hue/groups/list', hue.listGroups);
app.get('/hue/groups/get/:groupId', hue.getGroup);
app.get('/hue/groups/:groupId/scenes', hue.getGroupScenes);
app.get('/hue/groups/:groupId/state/:groupState', hue.toggleGroupActiveState);
app.get('/hue/scenes/:sceneId/activate', hue.activateScene);



const gauth = require('./app/controllers/google/google.auth.controller');
app.get('/google/authorize', gauth.getAuthorizeUrl);
app.get('/google/callback', gauth.storeToken)

const gmail = require('./app/controllers/google/google.gmail.controller');
app.get('/google/emails/:messageLimit', gmail.getEmailMessages)

const calendar = require('./app/controllers/google/google.calendar.controller');
app.get('/google/calendar', calendar.getCalendarEntries)


const tasks = require('./app/controllers/tasks.controller.js');
app.get('/tasks', tasks.findAll);
app.post('/tasks', tasks.create);
app.get('/tasks/:taskId', tasks.findOne);
app.patch('/tasks/:taskId/toggle', tasks.toggleCompleted);
app.delete('/tasks/:taskId', tasks.deleteOne);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    let code = 500;
    if (err.statusCode) code = err.statusCode; 
    res.status(code).send({message: err.message});
});

const httpsOptions = {
    key: fs.readFileSync('./security/cert-local.key'),
    cert: fs.readFileSync('./security/cert-local.pem')
}

const server = https.createServer(httpsOptions, app)
    .listen(process.env.PORT, () => {
        console.log('server running at ' + process.env.PORT)
});

/*
app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`)
)
*/
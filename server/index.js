require('dotenv').config();

const express = require('express');
const app = express();

const google = require('./routes/google.js');
const hue = require('./routes/hue.js');
const sonos = require('./routes/sonos.js');
const spotify = require('./routes/spotify.js');
const tasks = require('./routes/tasks.js');

const https = require('https');
const fs = require('fs');

const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose
	.connect(process.env.DB_url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connection to MongoDB established');
	})
	.catch((err) => {
		console.error('Unable to connect to MongoDB. Exiting ...', err);
		process.exit(1);
	});

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(
	cors({
		origin: 'http://localhost:3000',
	}),
);

const auth = require('./controllers/storedAuth.controller');
app.get('/auth/getCurrent', auth.getCurrent);

app.use('/google', google);
app.use('/hue', hue);
app.use('/sonos', sonos);
app.use('/spotify', spotify);
app.use('/tasks', tasks);

app.use(function (err, req, res, next) {
	console.error(err.stack);
	let code = 500;
	if (err.statusCode) code = err.statusCode;
	res.status(code).send({ message: err.message });
});

const httpsOptions = {
	key: fs.readFileSync('./security/cert-local.key'),
	cert: fs.readFileSync('./security/cert-local.pem'),
};

const server = https.createServer(httpsOptions, app).listen(process.env.PORT, () => {
	console.log('server running at ' + process.env.PORT);
});

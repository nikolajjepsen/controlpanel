const spotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');

const config = {
	clientId: process.env.Spotify_Id,
	clientSecret: process.env.Spotify_Secret,
	scope: ['user-modify-playback-state', 'user-read-playback-state'],
	tokenFile: './stoken.json',
};

const spotify = new spotifyWebApi({
	clientId: process.env.Spotify_Id,
	clientSecret: process.env.Spotify_Secret,
	redirectUri: 'http://localhost:3001/spotify/callback',
});

/*
    Send an authorize URL to the browser with current config
*/
const authorizeUrl = (req, res) => {
	res.send({
		url: spotify.createAuthorizeURL(config.scope),
	});
};

/*
    Store the token in a local file.
    If multiple users, like with Google, we'd need to attach the tokens to a user in a database.
*/
const storeToken = async (req, res) => {
	spotify.authorizationCodeGrant(req.query.code).then(
		(data) => {
			console.log(data);
			fs.writeFile(config.tokenFile, JSON.stringify(data.body), (err) => {
				if (err) console.log('Error saving tokens in local file.');

				console.log('Token stored in local file.');
			});
			spotify.setAccessToken(data.body.access_token);
			spotify.setRefreshToken(data.body.refresh_token);

			console.log(spotify);
		},
		(err) => {
			console.log('Error setting token, ', err.message);
		},
	);

	res.json({
		message: 'Stored token: ' + req.query.code,
	});
};

module.exports = {
	spotify,
	storeToken: storeToken,
	authorize: authorizeUrl,
};

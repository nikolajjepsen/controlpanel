const fs = require('fs');

/*
    This function returns an array of authenticated APIs based on locally stored tokens.
    IMPORTANT: Assumes the tokens are valid, but does NOT test it.
*/
const getCurrent = (req, res) => {
	let tokens = [];
	try {
		const googleTokenFile = fs.readFileSync('./gtoken.json', 'utf-8');
		googleTokenContents = JSON.parse(googleTokenFile);
		if (googleTokenContents.refresh_token && googleTokenContents.refresh_token != '') {
			tokens.push('google');
		}
	} catch (err) {
		console.log('Unable to find Google tokens', err.message);
	}

	try {
		const spotifyTokenFile = fs.readFileSync('./stoken.json', 'utf-8');
		spotifyTokenContents = JSON.parse(spotifyTokenFile);

		if (spotifyTokenContents.refresh_token && spotifyTokenContents.refresh_token != '') {
			tokens.push('spotify');
		}
	} catch (err) {
		console.log('Unable to find Spotify tokens', err.message);
	}

	res.send(tokens);
};

module.exports = { getCurrent };

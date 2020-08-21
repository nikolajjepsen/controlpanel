const { google } = require('googleapis');
const fs = require('fs');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');


const config = {
    clientId: process.env.Google_Id,
    clientSecret: process.env.Google_Secret,
    redirect: 'http://localhost:3001/google/callback',
    scopes: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/gmail.readonly'
    ]
}

const oAuth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirect
);

/* 
    Generate an authorization URL with our needed scopes
*/
const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.scopes
});

/*
    Send an authorization URL to the browser
*/
const getAuthorizeUrl = (req, res) => {
    res.json({
        url: authorizeUrl
    })
}

/*
    Store the returned tokens object in a file so we can refer back to this
    If we want multiple users, we would need a database to attach the tokens to the user.
*/
const storeToken = async (req, res) => {
    const {
        tokens
    } = await oAuth2Client.getToken(req.query.code);

    // oAuth2Client.setCredentials(tokens);

    fs.writeFile('./gtoken.json', JSON.stringify(tokens), (err) => {
        if (err) console.log('Error saving tokens in local file.');

        console.log('Token stored in local file.');
    })

    res.json({
        message: 'Stored token: ' + req.query.code
    });
}

/*
oAuth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
        fs.writeFile('./refresh_token.json', JSON.stringify({
            refresh_token: tokens.refresh_token
        }), (err) => {
            if (err) console.log('Error saving refresh token in local file.');

            console.log('Refresh token stored in local file.');
        })
        console.log(tokens.refresh_token);
    }
    console.log(tokens.access_token);
}); */

const unAuthorized = (req, res) => {
    res.send({
        message: 'User not authorized. Re-authorize.'
    })
}

/*
    Grab the stored tokens and set the credentials on the auth2 client.
*/
const setLoginCredentials = () => {
    if (Object.keys(oAuth2Client.credentials).length === 0) {
        // But in local file, use that
        const token = fs.readFileSync('./gtoken.json');
        oAuth2Client.setCredentials(JSON.parse(token));
    }
}

module.exports = {
    oAuth2Client, 
    setLoginCredentials: setLoginCredentials,
    getAuthorizeUrl: getAuthorizeUrl,
    storeToken: storeToken
};
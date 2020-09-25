const { google } = require('googleapis');
const fs = require('fs');

const { oAuth2Client, setLoginCredentials } = require('./google.auth.controller');

const getEmailMessages = async (req, res) => {
	// Checks if current oAuth2Client (auth.controller) has stored credentials.
	// If not, it tries grabbing from local file.
	setLoginCredentials();

	const gmail = google.gmail({
		version: 'v1',
		auth: oAuth2Client,
	});

	const messageList = await gmail.users.messages
		.list({
			userId: 'me',
		})
		.catch((err) => {
			console.error('Unable to establish connection to googleapis:', err.message);
			process.exit(1);
		});

	messageListLimited = messageList.data.messages.slice(0, req.params.messageLimit - 1);
	formattedMessagesList = [];
	for (const message of messageListLimited) {
		const messageData = await gmail.users.messages.get({
			userId: 'me',
			id: message.id,
			format: 'full',
		});

		let formattedMessage = new Object();
		// Add the needed properties to our object - subject, to, from, date, snippet, and labels.
		for (const headerPart of messageData.data.payload.headers) {
			if (headerPart.name == 'Subject') {
				formattedMessage.subject = headerPart.value;
			}
			if (headerPart.name == 'Delivered-To') {
				formattedMessage.delivered_to = headerPart.value;
			}
			if (headerPart.name == 'From') {
				formattedMessage.from = headerPart.value;
			}
			if (headerPart.name == 'Date') {
				formattedMessage.date = headerPart.value;
			}
		}
		formattedMessage.snippet = messageData.data.snippet;
		formattedMessage.labels = messageData.data.labelIds;

		formattedMessagesList.push(formattedMessage);
	}
	res.send(formattedMessagesList);
};

module.exports = {
	getEmailMessages: getEmailMessages,
};

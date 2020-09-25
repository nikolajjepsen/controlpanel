const { google } = require('googleapis');
const fs = require('fs');

const { oAuth2Client, setLoginCredentials } = require('./google.auth.controller');

const getCalendarEntries = async (req, res) => {
	// Checks if current oAuth2Client (auth.controller) has stored credentials.
	// If not, it tries grabbing from local file.
	setLoginCredentials();

	const calendar = google.calendar({
		version: 'v3',
		auth: oAuth2Client,
	});
	const entries = await calendar.events.list({
		calendarId: 'primary',
		timeMin: new Date().toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: 'startTime',
	});

	formattedEntriesList = [];
	for (const entry of entries.data.items) {
		console.log(entry);
		formattedEntry = new Object();
		formattedEntry.start_date = entry.start.dateTime;
		formattedEntry.end_date = entry.end.dateTime || null;
		formattedEntry.title = entry.summary;
		formattedEntry.location = entry.location || null;
		formattedEntry.creator = entry.creator.email;

		formattedEntriesList.push(formattedEntry);
	}

	console.log(formattedEntriesList);
	res.send(formattedEntriesList);
};

module.exports = {
	getCalendarEntries: getCalendarEntries,
};

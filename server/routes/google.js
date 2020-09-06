const express = require('express');
const router = express.Router();
const {
    getAuthorizeUrl,
    storeToken,
} = require('./../controllers/google/google.auth.controller');

const {
    getEmailMessages
} = require('../controllers/google/google.gmail.controller')

const {
    getCalendarEntries
} = require('../controllers/google/google.calendar.controller')

router.route('/authorize').get(getAuthorizeUrl);
router.route('/callback').get(storeToken);
router.route('/emails/:messageLimit').get(getEmailMessages);
router.route('/calendar').get(getCalendarEntries);

module.exports = router;
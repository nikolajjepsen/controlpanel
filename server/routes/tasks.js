const express = require('express');
const router = express.Router();
const {
	create,
	findAll,
	findOne,
	toggleCompleted,
	deleteOne,
} = require('../controllers/tasks.controller');

router.route('/').post(create);
router.route('/').get(findAll);
router.route('/:taskId').get(findOne);
router.route('/:taskId/toggle').patch(toggleCompleted);
router.route('/:taskId').delete(deleteOne);

module.exports = router;

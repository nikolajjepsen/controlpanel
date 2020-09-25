const Tasks = require('../models/tasks.model.js');

const create = (req, res) => {
	const err = [];
	// Basic validation
	if (!req.body.title) {
		err.push('Task title cannot be empty');
	}

	if (!req.body.type) {
		err.push('Task type cannot be empty');
	}

	if (err.length > 0) {
		res.status(400).json({
			message: err,
		});
		return;
	}

	console.log(req.body);
	// Create a new Task object for the Mongo DB.
	const task = new Tasks({
		title: req.body.title,
		description: req.body.description || '',
		type: req.body.type,
		amount: req.body.amount || 0,
		hidden: false,
		completed: false,
	});
	// Save it and return it.
	task.save()
		.then((createdTask) => {
			res.status(200).json({
				message: 'Task saved',
				insertedObject: createdTask,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: 'Unable to save task',
				error: err.message,
			});
		});
};

const toggleCompleted = (req, res) => {
	Tasks.findById(req.params.taskId)
		.then((task) => {
			console.log(task);
			task.completed = !task.completed;
			task.save()
				.then((newObj) => {
					res.json({
						message: 'Toggled completed status for ' + req.params.taskId,
						updatedObject: newObj,
					});
				})
				.catch((err) => {
					res.status(500).send({
						message:
							'Unable to toggle status for ' + req.params.taskId + ': Update Failed',
					});
				});
		})
		.catch((err) => {
			res.status(404).send({
				message: 'Unable to toggle status for ' + req.params.taskId + ': Not Found',
			});
		});
};

const findAll = (req, res) => {
	Tasks.find()
		.then((data) => {
			res.status(200).send(data);
		})
		.catch((err) => {
			res.status(500).json({
				message: err.message || 'Something went wrong retrieving tasks.',
			});
		});
};

const findOne = (req, res) => {
	Tasks.findById(req.params.taskId)
		.then((note) => {
			if (!note) {
				res.status(404).json({
					message: 'Unable to find task with id: ' + req.params.taskId,
				});
			}

			res.json(note);
		})
		.catch((err) => {
			res.json({
				message: err.message || 'Something went wrong retrieving the task.',
			});
		});
};

const deleteOne = (req, res) => {
	Tasks.deleteOne({ _id: req.params.taskId }, (err, result) => {
		if (err) {
			res.json({
				message: 'Unable to delete taskId: ' + req.params.taskId,
			});
		}

		res.status(200).json({
			message: 'taskId ' + req.params.taskId + ' removed.',
		});
	});
};

module.exports = {
	create: create,
	findAll: findAll,
	findOne: findOne,
	deleteOne: deleteOne,
	toggleCompleted,
};

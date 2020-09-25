const mongoose = require('mongoose');

const tasksSchema = new mongoose.Schema({
	title: String,
	description: String,
	type: String,
	amount: String,
	hidden: Boolean,
	completed: Boolean,
	timestamps: {
		createdAt: Date,
		updatedAt: Date,
	},
});

module.exports = mongoose.model('Tasks', tasksSchema);

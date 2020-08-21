module.exports = (app) => {
    const tasks = require('../controllers/tasks.controller.js');
    app.post('/tasks', tasks.create);
    app.get('/tasks', tasks.findAll);
    app.get('/tasks/:taskId', tasks.findOne);
    app.patch('/tasks/:taskId', tasks.update);
    app.delete('/tasks/:taskId', tasks.delete);
}


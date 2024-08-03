

const express = require('express');
const { Tasks, Users } = require('./data_tables');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Todo list app');
});

// Get all tasks for a specific user
router.get('/tasks/:userId', async (req, res) => {
    const { userId } = req.params;
    const user = await Users.findOne({ where: { Uid: userId } });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const tasks = await Tasks.findAll({ where: { UserId: userId } });
    res.json(tasks);
    console.log("Tasks found for user");
});

// Add a task for a specific user
router.post('/add/:userId', async (req, res) => {
    const { userId } = req.params;
    const { task, desc } = req.body;

    if (!task || !desc) {
        return res.status(400).json({ error: 'Task and description required' });
    }

    const user = await Users.findOne({ where: { Uid: userId } });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const myTsk = await Tasks.create({ task, desc, UserId: userId });
    res.json(myTsk);
    console.log("Task created for user");
});

// Update a task for a specific user
router.put('/update/:userId/:taskId', async (req, res) => {
    const { userId, taskId } = req.params;
    const { task, desc } = req.body;

    if (!task || !desc) {
        return res.status(400).json({ error: 'Task and description required for update' });
    }

    const user = await Users.findOne({ where: { Uid: userId } });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const exTask = await Tasks.findOne({ where: { id: taskId, UserId: userId } });
    if (!exTask) {
        return res.status(404).json({ error: 'Task not found' });
    }

    await Tasks.update({ task, desc }, { where: { id: taskId, UserId: userId } });
    res.send(req.body);
    console.log("Task updated for user");
});

// Delete a task for a specific user
router.delete('/delete/:userId/:taskId', async (req, res) => {
    const { userId, taskId } = req.params;

    const user = await Users.findOne({ where: { Uid: userId } });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const exTask = await Tasks.findOne({ where: { id: taskId, UserId: userId } });
    if (!exTask) {
        return res.status(404).json({ error: 'Task not found' });
    }

    await Tasks.destroy({ where: { id: taskId, UserId: userId } });
    res.send('Task deleted');
    console.log("Task deleted for user");
});

module.exports = router;


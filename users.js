const express = require('express');
const bodyParser = require('body-parser');
const { Users,myTasks } = require('./data_tables');
const router = express.Router();

const app = express();
app.use(bodyParser.json());

router.get('/users', async (req, res) => {
    // const users = await Users.findAll(); 
     const users = await Users.findAll({include: myTasks});  
    res.json(users);
    console.log("Users found");
});

router.post('/addusers', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    const uname = await Users.findOne({ where: { username } });
    if (uname) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    const user = await Users.create({ username, password });
    res.send(user);
});

router.delete('/deluser/:id', async (req, res) => {
    const { id } = req.params;
    const user = await Users.findOne({ where: { Uid: id } });

    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    await Users.destroy({ where: { Uid: id } });
    res.json(user);
    console.log("User deleted");
});

router.put('/updateuser/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await Users.findOne({ where: { Uid: id } });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const existingUser = await Users.findOne({ where: { username } });
    if (existingUser && existingUser.Uid !== parseInt(id)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    await Users.update({ username, password }, { where: { Uid: id } });
    res.send({ message: 'User updated successfully' });
});

module.exports = router;

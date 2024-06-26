const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
//db users code 
const { Sequelize, DataTypes } = require('sequelize');
const { default: getusers } = require('./users');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'notes.db',
})

app.use(bodyParser.json());

getusersers();

const Tasks = sequelize.define(
    'Tasks',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        tableName: 'dbUsers',
        timestamps: false,
    },
);

//checks the table is created or not
Tasks.sync({ alter: true });

app.get('/users', async (req, res) => {
    const users = await Tasks.findAll();
    res.json(users);
    console.log("tasks founded");
});

app.post('/addusers', async (req, res) => {
    const { username, password } = req.body;

    const uname = await Tasks.findOne({ where: { username } });
    // console.log(uname);
    if (!username || !password) {
        return res.status(400).json({ error: 'username and password required' })
    }
    if (uname != null && uname.username == username) {

        return res.status(400).json({ error: 'username already exists' })
    }
    //  console.log(typeof uname.username);
    //  console.log(typeof username);

    const user = await Tasks.create(
        {
            username,
            password,
        },

    );
    res.send(user)


})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'notes.db',
})

app.use(bodyParser.json());

const Users = sequelize.define(
    'Users',
    {
        Uid: {
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
Users.sync({ alter: true });

router.get('/users', async (req, res) => {
    const users = await Users.findAll();
    res.json(users);
    console.log("Users founded");
});

router.post('/addusers', async (req, res) => {
    const { username, password } = req.body;

    const uname = await Users.findOne({ where: { username } });
    // console.log(uname);
    if (!username || !password) {
        return res.status(400).json({ error: 'username and password required' })
    }
    if (uname != null && uname.username == username) {

        return res.status(400).json({ error: 'username already exists' })
    }
    //  console.log(typeof uname.username);
    //  console.log(typeof username);
    const user = await Users.create(
        {
            username,
            password,
        },

    );
    res.send(user)


});

   


module.exports = router;

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


//get all Users
router.get('/users', async (req, res) => {
    const users = await Users.findAll();
    res.json(users);
    console.log("Users founded");
});

//Insert Users
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

router.delete('/deluser/:id', async (req, res) => {
    const id = req.params.id;
    const Uid = await Users.findOne({ where: { Uid: parseInt(req.params.id) } });
    // console.log(typeof parseInt(Uid));
    // console.log(typeof parseInt(req.params.id));

    if (!Uid) {
        return res.status(400).json({ error: 'user not found' })
    }
    else {
        const user = await Users.destroy({ where: { Uid: id } });
        res.json(Uid);
        console.log(Uid);
        console.log("User deleted");
    };
});




module.exports = router;

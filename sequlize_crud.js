const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const { Sequelize, DataTypes } = require('sequelize');
const { type } = require('os');



const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'notes.db',
})


app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('todo list app');
});

//Defines the table with attribute
const Tasks = sequelize.define(
    'Tasks',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        task: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        desc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        tableName: 'myTasks',
        timestamps: false,
    },
);


//checks the table is created or not
Tasks.sync({ alter: true });




//get all method
app.get('/tasks', async (req, res) => {
    const tasks = await Tasks.findAll();
    res.json(tasks);
    console.log("tasks founded");
});
``




//Add the Task to the table
app.post('/add', async (req, res) => {
    const { task, desc } = req.body;
    if (!task || !desc) {
        return res.send('Missing task or desc');
    }

    const mytask = await Tasks.create(
        {
            task,
            desc,
        },

    );

    res.json(mytask);
    console.log("task created");
});


//update the task by id


app.put('/update/:id', async (req, res) => {

    if (!req.body.task || !req.body.desc) {
        return res.send('Missing task or desc for update');
    }

    const task = await Tasks.findOne({
        where: { id: parseInt(req.params.id) },
    });

    // console.log(typeof parseInt(req.params.id));
    // console.log(typeof task.id);

    if (!task) {
        return res.status(404).send('Task not found');
    }

    // console.log(typeof req.body.task);
    try {
        await Tasks.update(
            {
                task: req.body.task,
                desc: req.body.desc,
            },
            { where: { id: req.params.id } }
        );
        res.send(req.body);
    } catch (error) {
        res.status(500);
    }
});


app.delete('/delete/:id', async (req, res) => {
    await Tasks.destroy({
        where: {
            id: req.params.id,
        },
    });
    res.send('Task deleted');
},);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 5000;
const tasksRouter = require('./sequlize_crud');
const usersRouter = require('./users')
// const userRoute = require('./users');

app.use(express.json());
app.use(bodyParser.json());
app.use("/sequel", tasksRouter);
app.use("/User", usersRouter)

// http://localhost:5000/sequal/tasks

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
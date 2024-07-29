const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 5000;
const sequelizeRoute = require('./sequlize_crud');
const userRoute = require('./users')
// const userRoute = require('./users');

app.use(express.json());
app.use(bodyParser.json());
app.use("/sequel", sequelizeRoute);
app.use("/User", userRoute)

// http://localhost:5000/sequal/tasks

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
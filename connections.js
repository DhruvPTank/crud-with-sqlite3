const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const users = require('./users');
const seqdata = require('./sequlize_crud');


users.hasMany(seqdata, { foreignKey: 'Uid' });
seqdata.belongsTo(users, { foreignKey: 'Uid' });
app.use(bodyParser.json());
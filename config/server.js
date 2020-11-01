const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ejs = require('ejs');
const { json } = require('body-parser');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const consign = require('consign');
const jsonwebtoken = require('jsonwebtoken');
const { application } = require('express');

app.set('view engine', 'ejs');
app.set('views', './app/views/');

app.use(bodyParser.urlencoded());

consign()
    .include('./app/routes')
    .then('./config/dbConnection.js')
    .then('./app/models')
    .then('./app/controllers')
    .into(app);

module.exports = app;
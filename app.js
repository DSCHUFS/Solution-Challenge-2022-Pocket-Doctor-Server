const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { json } = require('./middlewares/result');
dotenv.config();

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/user', require('./routes/user'));

app.use(json.notFound);
app.use(json.result);
app.use(json.internalServerError);

module.exports = app;

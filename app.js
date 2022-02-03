const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { json } = require('./middlewares/result');
dotenv.config();

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('pocket doctor');
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/user', require('./routes/user'));

app.use(json.notFound);
app.use(json.result);
app.use(json.internalServerError);

const hostname = '10.178.0.3'
app.listen(process.env.PORT, async () => {
    console.log(`Server running at http://${hostname}:${process.env.PORT}`);
  });

// module.exports = app;

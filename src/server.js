const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('./routes.js');
const { errors } = require('celebrate');
const dotenv = require('dotenv');

const PORT = process.env.PORT || 3333;

const app = express();

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));


app.use(cors(
    // origin: 'http://'
));

app.use(express.json());

app.use(routes);

app.use(errors());

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
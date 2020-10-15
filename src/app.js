const express = require('express');
const artistControllers = require('./controllers/artists')

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('hello world')
})

app.post('/artists', artistControllers.create);

module.exports = app;
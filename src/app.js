const express = require('express');
const artistControllers = require('./controllers/artists')
const albumControllers = require('./controllers/albums')

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('hello world')
})

app.post('/artists', artistControllers.create);
app.get('/artists', artistControllers.list);
app.get('/artists/:id', artistControllers.find);
app.patch('/artists/:id', artistControllers.update);
app.delete('/artists/:id', artistControllers.delete);

app.post('/artists/:id/albums', albumControllers.create);
app.get('/artists/:id/albums', albumControllers.list);
app.get('/albums/:id', albumControllers.find);
app.patch('/albums/:id', albumControllers.update);
app.delete('/albums/:id', albumControllers.delete);

module.exports = app;
const express = require('express');
const app = express();

const cors = require('cors');
var compression = require('compression');
const db = require('./configs/db');
const all_routes = require('./all_route.js');





app.use(express.json());
app.use(cors());
app.use(compression());






app.get('/live', (req, res) => {
    res.send('Server is live!');
});

app.get('/', (req, res) => {
    res.send('Server is live!');
});



module.exports = app;
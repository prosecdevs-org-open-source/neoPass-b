const express = require('express');
const app = express();

app.get('/live', (req, res) => {
    res.send('Server is live!');
});

app.get('/', (req, res) => {
    res.send('Server is live!');
});



module.exports = app;
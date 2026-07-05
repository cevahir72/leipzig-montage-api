const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Leipzig Montage API');
});

module.exports = app;

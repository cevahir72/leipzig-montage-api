const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Leipzig Montage API');
});

app.use((err, req, res, next) => {
  console.error('Hata:', err);
  res.status(500).json({ error: 'Sunucu hatası' });
});

module.exports = app;

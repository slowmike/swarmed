const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./database/index');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../client/public')));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../client/public') });
});

app.get('/api/highScores', (req, res) => {
  db.getTopScores((err, highScores) => {
    if (err) console.err(err);
    res.status(200).send(highScores);
  });
});

app.post('/api/score', (req, res) => {
  db.addScore(req.body, (err) => {
    if (err) console.err(err);
    res.status(202).send();
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

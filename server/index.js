const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../client/public')));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../client/public') });
});

let highScores = [];

app.get('/api/highScores', (req, res) => {
  res.status(200).send(highScores);
});

app.post('/api/score', (req, res) => {
  highScores.push(req.body);
  highScores = highScores.sort((a, b) => b.score - a.score);
  console.log(highScores);
  res.status(202).send();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
})
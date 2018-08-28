const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/../client/public')));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../client/public') });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
})
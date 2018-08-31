const mongoose = require('mongoose');
const {
  user,
  pass,
  host,
  port,
  database,
} = require('./database');

mongoose.connect(`${user}:${pass}mongodb://${host}:${port}/${database}`, { useNewUrlParser: true })
  .catch((err) => {
    console.error(err);
  });

const highScoreSchema = mongoose.Schema({
  // TODO: your schema here!
  player: String,
  timeStamp: String,
  score: Number,
});

const highScores = mongoose.model('highScores', highScoreSchema);

const addScore = (scores, cb) => {
  highScores.create(scores, (err) => {
    if (err) cb(err);
    // console.log(highScores.obj);
    cb();
  });
};

const getTopScores = (cb, n = 10) => {
  highScores.find().sort({ score: -1 }).limit(n).exec(cb);
};

module.exports = {
  addScore,
  getTopScores,
};

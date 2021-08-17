const Datastore = require('nedb');
const Test = require('../entity/test')

const db = new Datastore({ filename: `${__dirname}/score.db` });
db.loadDatabase();


function getScoreByIdStudent(studentId, res) {
  db.find({ studentId: studentId , }, function (err, result) {
    res.json(result);
    res.end();
  });
}

function createScore(subjectCode, score, userId, date, response) {
  const test = new Test(userId, score, subjectCode, date)
  db.insert(test, function (err, res) {
    if (err) {
      response.json({ status: 400 });
      throw err;
    }
    response.json({ status: 200 })
    response.end();
  });
}

module.exports = { getScoreByIdStudent, createScore }
const Datastore = require('nedb');
const db = new Datastore({ filename: `${__dirname}/subject.db` });
db.loadDatabase();
const Subject = require('../entity/subject');
const { deleteQuizBySubjectCode } = require('./quizzesDao')

function getAllSubjects(res) {
  db.find({}, function (err, result) {
    if (err) throw err;
    res.json(result);
    res.end();
  });
}


function createSubject(subjectCode, subjectName, response) {
  const subject = new Subject(subjectCode, subjectName);
  db.insert(subject, function (err, res) {
    if (err) {
      response.json({ status: 400 });
      throw err;
    }
    response.json({ status: 200 })
    response.end();
  });
}

function deleteSubjectById(response, id) {
  db.findOne({ _id: id }, function (err, subject) {
    if (err) {
      throw err;
    }
    deleteQuizBySubjectCode(subject.subjectCode, response);
    db.remove({ _id: id }, {}, function (err, numRemoved) {
      if (err) {
        throw err;
      }
    });
    response.end();
  });

}

module.exports = { getAllSubjects, createSubject, deleteSubjectById }
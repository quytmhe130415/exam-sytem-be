const Datastore = require('nedb');
const db = new Datastore({ filename: `${__dirname}/quiz.db` });
db.loadDatabase();
const Quiz = require('../entity/quiz');

function getAllQuizzes(id, subjectCode, res) {
  db.find({ subjectCode: subjectCode, userId: id }, function (err, result) {
    if (err) throw err;
    res.json(result);
    res.end();
  });
}

function createQuiz(quizzes, response) {
  const quiz = new Quiz(quizzes.subject, quizzes.quiz.question, quizzes.quiz.answer, quizzes.quiz.status, quizzes.quiz.userId, quizzes.quiz.correct)
  db.insert(quiz, function (err, res) {
    if (err) {
      response.json({ status: 400 });
      throw err;
    }
    response.json({ status: 200 })
    response.end();
  });
}

function updateQuiz(payload, response) {
  const myQuery = { _id: payload.quizId };
  const newValues = { $set: payload.quiz };
  const option = {}
  db.update(myQuery, newValues, option, function (err, res) {
    if (err) {
      response.json({ status: 400 });
      throw err;
    }
    response.json({ status: 200 })
    response.end();
  });
}

function disableQuiz(payload, response) {
  const myQuery = { _id: payload.quiz._id };
  const newValues = { $set: { status: !payload.quiz.status } };
  const option = {};
  db.update(myQuery, newValues, option, function (err, res) {
    if (err) {
      response.json({ status: 400 });
      throw err;
    }
    response.json({ status: 200 })
    response.end();
  });
}

function getExam(id, subjectCode, res) {
  let exam = [];
  db.find({ subjectCode: subjectCode, userId: id, status: true }, function (err, result) {
    if (err) throw err;

    for (const quiz of result) {
      exam.push({ question: quiz.question, answer: quiz.answer, _id: quiz._id, correctLength: quiz.correct.length })
    }
    res.json(exam);
    res.end();
  });
}

const deleteQuizBySubjectCode = (subjectCode) => {
  console.log(subjectCode)
  db.remove({ subjectCode: subjectCode }, { multi: true }, function (err, numRemoved) {
    if (err) {
      throw err;
    }
  });
}

const caculatorScore = async (exam, userId, subjectCode) => {
  try {
    let sum = 0;

    for (const question of exam) {
      const score = await getScore(question, userId, subjectCode)
      sum += score
    }
    return sum;
  } catch (error) { }
}

function getScore(question, userId, subjectCode) {
  return new Promise((resolve, reject) => {
    db.find({ subjectCode: subjectCode, userId: userId, _id: question.questionId }, function (err, result) {
      if (err) throw err;
      let score = 0;
      const correctPerMark = 1 / result[0].correct.length;
      if (question.textAnswers) {
        for (let j = 0; j < question.textAnswers.length; j++) {
          for (let i = 0; i < result[0].correct.length; i++) {
            if (result[0].correct.length === 1) {
              if (question.textAnswers[j] == result[0].answer[result[0].correct[i]]) {
                score += correctPerMark;
              }
            } else {
              if (question.textAnswers[j] == result[0].answer[result[0].correct[i]]) {
                score += correctPerMark;
              }
            }
          }
        }
      }
      resolve(score);
    });
  })
}


module.exports = {
  getAllQuizzes,
  createQuiz,
  updateQuiz,
  disableQuiz,
  getExam,
  deleteQuizBySubjectCode,
  caculatorScore
}
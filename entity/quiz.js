class Quiz {
  constructor(subjectCode, question, answer, status, userId, correct) {
    this.question = question;
    this.answer = answer;
    this.status = status;
    this.userId = userId;
    this.correct = correct;
    this.subjectCode = subjectCode;
  }
}
module.exports = Quiz;
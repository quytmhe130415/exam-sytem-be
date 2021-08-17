const Datastore = require('nedb');

const db = new Datastore({ filename: `${__dirname}/account.db` });
db.loadDatabase();

function createUser(userName, pass, rule) {
  const user = { userName: userName, pass: pass, rule: rule };
  db.insert(user, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });
}


function getStudent(userName, pass, res) {
  db.findOne({ userName: userName, pass: pass }, function (err, result) {
    if (err) throw err;
    res.json(result);
    res.end();
  });
}

function getAllStudent(res) {
  db.find({ rule: 0 }, function (err, result) {
    if (err) throw err;
    res.json(result);
    res.end();
  });
}

module.exports = {
  getStudent,
  createUser,
  getAllStudent
}





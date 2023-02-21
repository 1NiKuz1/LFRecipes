const db = require("../config/db.config.js");

class UserModel {
  insertUser(data) {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO Users SET ?", [data], (err, results) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  findUserByExtend(extend, data) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * from USERS WHERE ${extend} = "${data}"`,
        (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  }

  updateActivateUserByExtend(extend, data) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE USERS SET is_activated = 1 WHERE ${extend} = "${data}"`,
        (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  }
}

module.exports = new UserModel();

//exports.insertUser = (data) => {
//  return new Promise((resolve, reject) => {
//    db.query("INSERT INTO Users SET ?", [data], (err, results) => {
//      if (err) {
//        console.log(err);
//        reject(err);
//      } else {
//        resolve(results);
//      }
//    });
//  });
//};

//exports.findUserByExtend = (extend, data) => {
//  return new Promise((resolve, reject) => {
//    db.query(
//      `SELECT * from USERS WHERE ${extend} = "${data}"`,
//      (err, results) => {
//        if (err) {
//          console.log(err);
//          reject(err);
//        } else {
//          resolve(results[0]);
//        }
//      }
//    );
//  });
//};

//exports.updateActivateUserByExtend = (extend, data) => {
//  return new Promise((resolve, reject) => {
//    db.query(
//      `UPDATE USERS SET is_activated = 1 WHERE ${extend} = "${data}"`,
//      (err, results) => {
//        if (err) {
//          console.log(err);
//          reject(err);
//        } else {
//          resolve(results[0]);
//        }
//      }
//    );
//  });
//};

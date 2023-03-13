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

  updateUser(setField, setValue, whereField, whereValue) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE USERS SET ${setField} = "${setValue}" WHERE ${whereField} = "${whereValue}"`,
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

  updateImageUserById(image, id) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE USERS SET img = ? WHERE id_user = ?`,
        [image, id],
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

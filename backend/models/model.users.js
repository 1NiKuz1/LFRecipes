const db = require("../config/db.config.js");

class UserModel {
  getUsersWithoutAdmins() {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT id_user, login, email, id_role, is_activated FROM users WHERE id_role != 3",
        (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

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

  updateUser(id, data) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET ? WHERE id_user = ?`,
        [data, id],
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

  deleteUser(id) {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM users WHERE id_user = ?", [id], (err, results) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = new UserModel();

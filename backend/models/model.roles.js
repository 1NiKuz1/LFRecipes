const db = require("../config/db.config.js");

class RoleModel {
  getRoles() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM roles", (err, results) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  getRole(data) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT name from Roles WHERE id_role = ?`,
        [data],
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

  getIdRole(data) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT id_role from Roles WHERE name = ?`,
        [data],
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

module.exports = new RoleModel();

//exports.getRoles = () => {
//  return new Promise((resolve, reject) => {
//    db.query("SELECT * FROM roles", (err, results) => {
//      if (err) {
//        console.log(err);
//        reject(err);
//      } else {
//        resolve(results);
//      }
//    });
//  });
//};

//exports.getRole = (data) => {
//  return new Promise((resolve, reject) => {
//    db.query(
//      `SELECT name from Roles WHERE id_role = ?`,
//      [data],
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

//exports.getIdRole = (data) => {
//  return new Promise((resolve, reject) => {
//    db.query(
//      `SELECT id_role from Roles WHERE name = ?`,
//      [data],
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

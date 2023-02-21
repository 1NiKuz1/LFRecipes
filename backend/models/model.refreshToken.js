const db = require("../config/db.config.js");
const config = require("../config/auth.config");
const { v4: uuidv4 } = require("uuid");

class RefreshTokenModel {
  insertToken(data) {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);
    const newData = {
      id_user: data.id_user,
      token: uuidv4(),
      expiry_date: expiredAt,
    };
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO refresh_token SET ?", [newData], (err, results) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  findTokenByExtend(extend, data) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * from refresh_token WHERE ${extend} = "${data}"`,
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

  destroyTokenByExtend(extend, data) {
    return new Promise((resolve, reject) => {
      db.query(
        `DELETE from refresh_token WHERE ${extend} = "${data}"`,
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

  verifyExpiration(token) {
    return token.expiry_date.getTime() < new Date().getTime();
  }
}

module.exports = new RefreshTokenModel();

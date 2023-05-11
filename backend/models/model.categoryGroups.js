const db = require("../config/db.config.js");

class CategoryGroupModel {
  insertCategoryGroup(data) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO product_category_group SET ?",
        [data],
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

  getCategoryGroups() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM product_category_group", (err, results) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  updateCategoryGroup(id, data) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE product_category_group SET ? WHERE id = ?`,
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

  deleteCategoryGroup(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM product_category_group WHERE id = ?",
        [id],
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
}

module.exports = new CategoryGroupModel();

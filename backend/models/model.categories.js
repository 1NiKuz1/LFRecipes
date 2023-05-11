const db = require("../config/db.config.js");

class CategoryModel {
  insertCategory(data) {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO product_category SET ?", [data], (err, results) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  getCategories() {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT pc.id, pc.category_name, pcg.group_name
        FROM product_category AS pc
        LEFT JOIN product_category_group AS pcg
        ON pc.id_category_group = pcg.id;`,
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

  getCategoriesByGroupId(id) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM product_category WHERE id_category_group = ?`,
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

  getCategoryById(id) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT category_name FROM product_category WHERE id = ?`,
        [id],
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

  updateCategory(id, data) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE product_category SET ? WHERE id = ?`,
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

  deleteCategory(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM product_category WHERE id = ?",
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

module.exports = new CategoryModel();

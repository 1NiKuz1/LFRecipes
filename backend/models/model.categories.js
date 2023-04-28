const db = require("../config/db.config.js");

class CategoryModel {
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
}

module.exports = new CategoryModel();

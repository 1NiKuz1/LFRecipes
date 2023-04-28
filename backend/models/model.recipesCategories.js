const db = require("../config/db.config.js");

class RecipeCategoryModel {
  insertRecipeCategory(data) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO recipes_categories SET ?",
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

  getRecipeCategories() {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT id_recipe, id_category FROM recipes_categories`,
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

module.exports = new RecipeCategoryModel();

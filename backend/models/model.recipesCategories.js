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

  getRecipeCategoriesByRecipeId(id) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT id_category FROM recipes_categories WHERE id_recipe = ?`,
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

  deleteRecipeCategories(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM recipes_categories WHERE id_recipe = ?",
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

  deleteRecipeCategoriesByIdCategory(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM recipes_categories WHERE id_category = ?",
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

  deleteAllRecipeCategories(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM recipes_categories WHERE FIND_IN_SET(id_recipe, ?) > 0",
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

module.exports = new RecipeCategoryModel();

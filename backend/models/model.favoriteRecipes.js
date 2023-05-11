const db = require("../config/db.config.js");

class FavoriteRecipeModel {
  addFavoriteRecipe(data) {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO favorite_recipes SET ?", [data], (err, results) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  getUserFavoriteRecipes(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT id_recipe FROM favorite_recipes WHERE id_user = ?",
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

  deleteUserFavoriteRecipe(id_user, id_recipe) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM favorite_recipes WHERE id_user = ? AND id_recipe = ?",
        [id_user, id_recipe],
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

  deleteAllUserFavoriteRecipes(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM favorite_recipes WHERE id_user = ?",
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

  deleteFavoriteRecipe(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM favorite_recipes WHERE id_recipe = ?",
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

module.exports = new FavoriteRecipeModel();

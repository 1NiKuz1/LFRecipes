const db = require("../config/db.config.js");

class RecipeModel {
  insertRecipe(data) {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO recipes SET ?", [data], (err, results) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  getRecipes() {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT id, name, description, video_link, id_user, created_at, updated_at from recipes`,
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

  findRecipeByExtend(extend, data) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * from recipes WHERE ${extend} = "${data}"`,
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

  updateRecipe(setField, setValue, whereField, whereValue) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE recipes SET ${setField} = "${setValue}" WHERE ${whereField} = "${whereValue}"`,
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

  updateImageRecipeById(image, id) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE recipes SET img = ? WHERE id = ?`,
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

module.exports = new RecipeModel();

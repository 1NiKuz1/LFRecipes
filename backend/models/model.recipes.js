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

  updateRecipe(id, data) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE recipes SET ? WHERE id = ?`,
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

  getAllUserRecipes(id) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT id FROM recipes WHERE id_user = ?`,
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

  getRecipes(data) {
    return new Promise((resolve, reject) => {
      const inner = data.filters
        ? `INNER JOIN recipes_categories AS rc ON r.id = rc.id_recipe AND FIND_IN_SET(rc.id_category, "${data.filters}") > 0`
        : "";
      const where = `WHERE name LIKE "%${data.name}%"`;
      const order = `ORDER BY r.${data.sort} ${data.sortParam}`;
      const limit = `LIMIT ${(data.page - 1) * data.limit}, ${data.limit}`;
      db.query(
        `SELECT DISTINCT r.id, r.name, r.description, r.video_link, r.id_user, r.created_at, r.updated_at FROM recipes AS r ` +
          inner +
          " " +
          where +
          " " +
          order +
          " " +
          limit,
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

  async getUserRecipes(data) {
    const where = data.id_user ? `WHERE id_user = ${data.id_user}` : "";
    const limit = `LIMIT ${(data.page - 1) * data.limit}, ${data.limit}`;
    let recipes = [];
    let totalRecords = 0;

    return new Promise((resolve, reject) => {
      db.query(
        `SELECT id, name, description, video_link, id_user, created_at, updated_at FROM recipes ` +
          where +
          " " +
          limit,
        (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            recipes = results;
            db.query(
              `SELECT COUNT(*) AS total_records FROM recipes ` + where,
              (err, results) => {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  totalRecords = results[0].total_records;
                  resolve({
                    recipes: recipes,
                    totalRecords: totalRecords,
                  });
                }
              }
            );
          }
        }
      );
    });
  }

  async getUserFavoriteRecipes(data) {
    const where = data.recipes
      ? `WHERE FIND_IN_SET(id, "${data.recipes}") > 0`
      : "";
    const limit = `LIMIT ${(data.page - 1) * data.limit}, ${data.limit}`;
    let recipes = [];
    let totalRecords = 0;

    return new Promise((resolve, reject) => {
      db.query(
        `SELECT id, name, description, video_link, id_user, created_at, updated_at FROM recipes ` +
          where +
          " " +
          limit,
        (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            recipes = results;
            db.query(
              `SELECT COUNT(*) AS total_records FROM recipes ` + where,
              (err, results) => {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  totalRecords = results[0].total_records;
                  resolve({
                    recipes: recipes,
                    totalRecords: totalRecords,
                  });
                }
              }
            );
          }
        }
      );
    });
  }

  getTotalRecords(data) {
    return new Promise((resolve, reject) => {
      const inner = data.filters
        ? `INNER JOIN recipes_categories AS rc ON r.id = rc.id_recipe AND FIND_IN_SET(rc.id_category, "${data.filters}") > 0`
        : "";
      const where = `WHERE name LIKE "%${data.name}%"`;
      const order = `ORDER BY r.${data.sort} ${data.sortParam}`;
      db.query(
        `SELECT COUNT(r.id) AS count_pages FROM recipes AS r ` +
          inner +
          " " +
          where +
          " " +
          order +
          " ",
        (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(results[0].count_pages);
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

  deleteRecipe(id) {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM recipes WHERE id = ?", [id], (err, results) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  deleteUserRecipes(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM recipes WHERE id_user = ?",
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

module.exports = new RecipeModel();

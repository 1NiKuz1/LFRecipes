const RoleModel = require("../models/model.roles.js");
class RoleController {
  async getRoles(req, res, next) {
    try {
      const roles = await RoleModel.getRoles();
      return res.json(roles);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "Недопустимый запрос к базе данных", err));
    }
  }
}

module.exports = new RoleController();

class UserController {
  async all(req, res) {
    try {
      return res.status(200).send("Public Content.");
    } catch (err) {
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async user(req, res) {
    try {
      return res.status(200).send("User Content.");
    } catch (err) {
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async admin(req, res) {
    try {
      return res.status(200).send("Admin Content.");
    } catch (err) {
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async moderator(req, res) {
    try {
      return res.status(200).send("Moderator Content.");
    } catch (err) {
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }
}

module.exports = new UserController();

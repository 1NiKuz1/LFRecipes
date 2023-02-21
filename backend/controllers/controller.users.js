class UserController {
  async all(req, res) {
    try {
      res.status(200).send("Public Content.");
    } catch (err) {
      return res.status(500).send({
        message: "invalid database request",
        error: err,
      });
    }
  }

  async user(req, res) {
    try {
      res.status(200).send("User Content.");
    } catch (err) {
      return res.status(500).send({
        message: "invalid database request",
        error: err,
      });
    }
  }

  async admin(req, res) {
    try {
      res.status(200).send("Admin Content.");
    } catch (err) {
      return res.status(500).send({
        message: "invalid database request",
        error: err,
      });
    }
  }

  async moderator(req, res) {
    try {
      res.status(200).send("Moderator Content.");
    } catch (err) {
      return res.status(500).send({
        message: "invalid database request",
        error: err,
      });
    }
  }
}

module.exports = new UserController();

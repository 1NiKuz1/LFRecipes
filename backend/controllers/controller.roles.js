const { getRoles, getRole } = require("../models/model.roles.js");

exports.showRoles = (req, res) => {
  getRoles((err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

exports.showRole = (req, res) => {
  getRole(req.body.id_role, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

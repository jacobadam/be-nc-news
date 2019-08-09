const { viewAllUserObjects } = require("../models/users-model");

exports.getUserObjects = (req, res, next) => {
  viewAllUserObjects(req.params)
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

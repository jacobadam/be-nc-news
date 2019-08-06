const { viewAllUserObjects } = require("../models/users-model");

exports.getUserObjects = (req, res, next) => {
  viewAllUserObjects(req.params)
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

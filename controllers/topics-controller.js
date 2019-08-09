const { viewAllTopicObjects } = require("../models/topics-model");

exports.getTopicObjects = (req, res, next) => {
  viewAllTopicObjects(req.query)
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
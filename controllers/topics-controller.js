const { viewAllTopicObjects } = require("../models/topics-models");

exports.getTopicObjects = (req, res, next) => {
  viewAllTopicObjects(req.query)
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

// req.params to find out what :ID is sent by the router

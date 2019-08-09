const topicsRouter = require("express").Router();
const { getTopicObjects } = require("../controllers/topics-controller");
const { send405Error } = require("../errors/errors");

topicsRouter
  .route("/")
  .get(getTopicObjects)
  .all(send405Error);

module.exports = topicsRouter;

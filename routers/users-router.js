const usersRouter = require("express").Router();
const { getUserObjects } = require("../controllers/users-controller");
const { send405Error } = require("../errors/errors");

usersRouter
  .route("/:username")
  .get(getUserObjects)
  .all(send405Error);

module.exports = usersRouter;

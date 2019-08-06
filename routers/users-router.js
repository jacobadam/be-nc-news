const usersRouter = require("express").Router();
const { getUserObjects } = require("../controllers/users-controller");

usersRouter.route("/:username").get(getUserObjects);

module.exports = usersRouter;

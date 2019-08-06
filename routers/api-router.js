const apiRouter = require("express").Router();
const topicsRouter = require('./topics-router');

apiRouter.use("/topics", topicsRouter);
// console.log("in the apiRouter");

module.exports = apiRouter;

const topicsRouter = require("express").Router();
const { getTopicObjects } = require('../controllers/topics-controller');

topicsRouter.route("/").get(getTopicObjects);
// console.log("in topics router");


module.exports = topicsRouter;

// 'REMOVE topic' as a controller name for delete request
// test for DELETE - delete not existing house -
// delete house that is referred to in other tables

const articlesRouter = require("express").Router();
const { getAllArticleObjects } = require("../controllers/articles-controller");

articlesRouter.route("/:article_id").get(getAllArticleObjects);

module.exports = articlesRouter;
const articlesRouter = require("express").Router();
const {
  getAllArticleObjects,
  patchIncVoteById
} = require("../controllers/articles-controller");

articlesRouter
  .route("/:article_id")
  .get(getAllArticleObjects)
  .patch(patchIncVoteById);

module.exports = articlesRouter;

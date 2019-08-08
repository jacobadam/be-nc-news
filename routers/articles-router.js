const articlesRouter = require("express").Router();
const {
  getAllArticleObjects,
  patchIncVoteById,
  postComment,
  getCommentsById,
  getAllArticles
} = require("../controllers/articles-controller");

articlesRouter
  .route("/:article_id")
  .get(getAllArticleObjects)
  .patch(patchIncVoteById);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentsById);

articlesRouter.route("/").get(getAllArticles);


module.exports = articlesRouter;

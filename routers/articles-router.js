const articlesRouter = require("express").Router();
const {
  getAnArticleObject,
  patchIncVoteById,
  postComment,
  getCommentsById,
  getAllArticles
} = require("../controllers/articles-controller");
const { send405Error } = require("../errors/errors");

articlesRouter
  .route("/:article_id")
  .get(getAnArticleObject)
  .patch(patchIncVoteById)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentsById)
  .all(send405Error);

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(send405Error);

module.exports = articlesRouter;

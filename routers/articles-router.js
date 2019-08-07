const articlesRouter = require("express").Router();
const {
  getAllArticleObjects,
  patchIncVoteById,
  postComment
} = require("../controllers/articles-controller");

articlesRouter
  .route("/:article_id")
  .get(getAllArticleObjects)
  .patch(patchIncVoteById);

articlesRouter.route("/:article_id/comments").post(postComment).get;

module.exports = articlesRouter;

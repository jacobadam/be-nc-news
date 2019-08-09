const commentsRouter = require("express").Router();
const {
  patchIncVoteByCommentId,
  deleteCommentById
} = require("../controllers/comments-controller");
const { send405Error } = require("../errors/errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchIncVoteByCommentId)
  .delete(deleteCommentById)
  .all(send405Error);

module.exports = commentsRouter;

const commentsRouter = require("express").Router();

commentsRouter.route("/comments/:comment_id").patch(patchIncVoteByCommentId);

module.exports = commentsRouter;

const {
  updateCommentsVote,
  removeCommentById
} = require("../models/comments-model");

exports.patchIncVoteByCommentId = (req, res, next) => {
  updateCommentsVote(req.params, req.body)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(comments => {
      res.sendStatus(204);
    })
    .catch(next);
};

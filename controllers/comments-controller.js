const {
  updateCommentsVote,
  removeCommentById
} = require("../models/comments-model");

exports.patchIncVoteByCommentId = (req, res, next) => {
  const { parameter, value } = req.body;
  const { comment_id } = req.params;
  updateCommentsVote(comment_id, parameter, value)
    .then(comments => {
      res.status(200).send({ comments });
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

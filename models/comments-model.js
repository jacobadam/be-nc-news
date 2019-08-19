const connection = require("../db/connection");

exports.updateCommentsVote = ({comment_id}, {inc_votes = 0}) => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .increment('votes', inc_votes)
    .returning("*")
    .then(comment => {
      if (!comment.length) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      } else {
        return comment;
      }
    });
};
exports.removeCommentById = comment_id => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .del()
    .then(comment => {
      if (comment <= 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      } else if (comment > 0) {
        return { msg: "deleted count" };
      }
    });
};

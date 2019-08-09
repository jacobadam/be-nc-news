const connection = require("../db/connection");

exports.updateCommentsVote = (comment_id, parameter, value) => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .increment(parameter, value)
    .returning("*")
    .then(response => {
      if (!response.length) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      } else {
        return response;
      }
    });
};
exports.removeCommentById = comment_id => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .del()
    .then(response => {
      if (response <= 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
};

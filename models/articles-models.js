const connection = require("../db/connection");

exports.viewAllArticleObjects = ({ article_id }) => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .where("articles.article_id", "=", article_id)
    .groupBy("articles.article_id")
    .then(response => {
      if (!response.length) {
        return Promise.reject({ status: 404, msg: "username not found" });
      } else {
        return response;
      }
    });
};

exports.updateArticleVote = (article_id, parameter, value) => {
  return connection("articles")
    .where("article_id", "=", article_id)
    .increment(parameter, value)
    .returning("*")
    .then(response => {
      if (!response.length) {
        return Promise.reject({ status: 404, msg: "username not found" });
      } else {
        return response;
      }
    });
};

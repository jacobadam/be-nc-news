const connection = require("../db/connection");

exports.viewAllArticleObjects = ({ article_id }) => {
  return connection
    .where("article_id", article_id)
    .select("*")
    .from("articles")
    .then(response => {
      return response;
    });
};

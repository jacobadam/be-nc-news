const connection = require("../db/connection");

exports.viewAnArticleObjectById = ({ article_id }) => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .where("articles.article_id", "=", article_id)
    .groupBy("articles.article_id")
    .then(article => {
      article.map(comment => {
        comment.comment_count = Number(comment.comment_count);
        return comment;
      });
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "article not found" });
      } else {
        return article;
      }
    });
};

exports.updateArticleVote = ({ article_id }, { inc_votes = 0 }) => {
  return connection("articles")
    .where("article_id", "=", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "article not found" });
      } else {
        return article;
      }
    });
};

exports.insertComment = (article_id, username, body) => {
  return connection("comments")
    .insert(article_id, username, body)
    .returning("*")
    .then(article => {
      if (article[0].author === null) {
        return Promise.reject({ status: 404, msg: "username not found" });
      } else {
        return article;
      }
    });
};

exports.viewAllCommentsById = (article_id, { sort_by, order = "desc" }) => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order)
    .then(comments => {
      if (!["asc", "desc"].includes(order)) {
        return Promise.reject({ status: 400, msg: "order input not valid" });
      }
      if (comments.length === 0) {
        const articleCheck = exports.viewAnArticleObjectById({ article_id });
        return Promise.all([articleCheck, comments]).then(
          ([articleCheckRes]) => {
            if (articleCheckRes[0].comment_count === 0) {
              return [];
            } else {
              return Promise.reject({
                status: 404,
                msg: "article not found"
              });
            }
          }
        );
      } else return comments;
    });
};

exports.viewAllArticles = ({ sort_by, order, author, topic }) => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify(articleQuery => {
      if (author) articleQuery.where("articles.author", "=", author);
      if (topic) articleQuery.where("articles.topic", "=", topic);
    })
    .then(articles => {
      if (!articles.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return articles;
      }
    });
};

const {
  viewAnArticleObjectById,
  updateArticleVote,
  insertComment,
  viewAllCommentsById,
  viewAllArticles
} = require("../models/articles-model");

exports.getAnArticleObject = (req, res, next) => {
  viewAnArticleObjectById(req.params)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchIncVoteById = (req, res, next) => {
  updateArticleVote(req.params, req.body)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  viewAnArticleObjectById({ article_id })
    .then(() => insertComment({ article_id, author: username, body }))
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  viewAllCommentsById(article_id, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  viewAllArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

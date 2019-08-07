const {
  viewAllArticleObjects,
  updateArticleVote,
  insertComment
} = require("../models/articles-models");

exports.getAllArticleObjects = (req, res, next) => {
  viewAllArticleObjects(req.params)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchIncVoteById = (req, res, next) => {
  const { article_id } = req.params;
  const { parameter, value } = req.body;
  updateArticleVote(article_id, parameter, value)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertComment({ article_id, author: username, body: body })
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

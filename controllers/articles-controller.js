const {
  viewAllArticleObjects,
  updateArticleVote
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
      res.status(201).send({ articles });
    })
    .catch(next);
};

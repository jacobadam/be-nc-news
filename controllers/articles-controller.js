const { viewAllArticleObjects } = require("../models/articles-models");

exports.getAllArticleObjects = (req, res, next) => {
  viewAllArticleObjects(req.params)
  .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

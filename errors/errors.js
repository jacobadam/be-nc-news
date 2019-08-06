exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
exports.handlePsqlErrors = () => {};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
  console.log(err, '500 err')
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.status === "42703" || "22P02" || "23503") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
  console.log(err, "500 err");
};

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

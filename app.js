const express = require("express");
const app = express();
app.use(express.json());
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors
} = require("./errors/errors");
const apiRouter = require("./routers/api-router");
const cors = require("cors");

app.use(cors());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "route not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;

const express = require("express");
const app = express();
app.use(express.json());
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  send405Error
} = require("./errors/errors");
const apiRouter = require("./routers/api-router");

//app.get("/", (req, res) => res.send("all ok from the server"));

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "route not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.use(send405Error);

module.exports = app;

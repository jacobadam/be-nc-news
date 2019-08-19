connection = require("../db/connection");

exports.viewAllTopicObjects = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};

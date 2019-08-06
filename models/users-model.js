const connection = require("../db/connection");

exports.viewAllUserObjects = ({ username }) => {
  return connection
    .where("username", username)
    .select("*")
    .from("users")
    .then(response => {
      return response;
    });
};

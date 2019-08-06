const connection = require("../db/connection");

exports.viewAllUserObjects = ({ username }) => {
  return connection
    .where("username", username)
    .select("*")
    .from("users")
    .then(response => {
      if (!response.length) {
        return Promise.reject({ status: 404, msg: "username not found" });
      } else {
        return response;
      }
    });
};

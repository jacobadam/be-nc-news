const connection = require("../db/connection");

exports.viewAllUserObjects = ({ username }) => {
  return connection
    .where("username", username)
    .select("*")
    .from("users")
    .then(users => {
      if (!users.length) {
        return Promise.reject({ status: 404, msg: "username not found" });
      } else {
        return users;
      }
    });
};

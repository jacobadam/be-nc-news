const knex = require("knex");
const dbConfig = require('../knexfile'); // opens connection to database
const connection = knex(dbConfig); //send to connection file

module.exports = connection;

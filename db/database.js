const Sequelize = require("sequelize");

const connection = new Sequelize("node_api", "root", "150725", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;

const Sequelize = require("sequelize");
const connection = require("./database");

const Game = connection.define("games", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  year: {
    type: Sequelize.FLOAT,
    allowNull: null,
  },
});

// Game.sync({ force: true }).then(() => {});
module.exports = Game;

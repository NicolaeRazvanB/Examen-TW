const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./sqlite/data.db",
});

module.exports = sequelize;

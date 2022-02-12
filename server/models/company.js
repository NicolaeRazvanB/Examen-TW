const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

const Company = sequelize.define("company", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 3,
    },
  },
  foundingdate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Company;

const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

const Founder = sequelize.define("founder", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    min: 5,
  },
  role: {
    type: DataTypes.ENUM("CEO", "CTO", "BD", "CFO", "CIO"),
    allowNull: false,
    validate: {
      isIn: {
        args: [["CEO", "CTO", "BD", "CFO", "CIO"]],
        msg: "Must be a valid role",
      },
    },
  },
});

module.exports = Founder;

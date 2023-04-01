const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Blocklist = sequelize.define("Blocklist", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Blocklist;

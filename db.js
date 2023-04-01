const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("test", "erp", "root", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.sync();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = sequelize;

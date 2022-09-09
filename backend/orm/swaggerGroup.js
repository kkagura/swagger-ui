const { DataTypes } = require("sequelize");
exports.modelName = "swaggerGroup";
exports.options = {
  tableName: "swagger_group",
};
exports.attributes = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  creator: {
    type: DataTypes.STRING,
  },
  updater: {
    type: DataTypes.STRING,
  },
};

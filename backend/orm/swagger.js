const { DataTypes } = require("sequelize");
exports.modelName = "swagger";
exports.options = {
  tableName: "swagger_config",
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
  path: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  tag: {
    type: DataTypes.STRING,
  },
};

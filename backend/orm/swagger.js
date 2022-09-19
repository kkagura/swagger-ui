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
  name2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name3: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tag: {
    type: DataTypes.STRING,
  },
  groupId: {
    type: DataTypes.STRING,
    field: "group_id",
  },
  creator: {
    type: DataTypes.STRING,
  },
  updater: {
    type: DataTypes.STRING,
  },
};

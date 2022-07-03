const { Sequelize } = require("sequelize");
const conf = require("../config");
const models = require("./loadModels");
const extend = require("./extend");

const db = conf.db;
const sequelize = new Sequelize(db.database, db.user, db.password, {
  host: db.host || "localhost",
  dialect: "mysql",
  pool: db.pool || {
    max: 30,
    min: 0,
    idle: 10000,
  },
  timezone: db.timezone || "+08:00",
  logging: db.showSql ? console.log : false,
});

function define() {
  models.forEach((model) => {
    const { modelName, attributes, options } = model;
    const orm = sequelize.define(modelName, attributes, options);
    extend(orm);
  });
  if (db.isSync) {
    sequelize.sync({ force: !!db.isForce });
  }
}
define();

module.exports = sequelize;

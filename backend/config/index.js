const fs = require("fs");
const path = require("path");
const defaultConf = require("./config.json");
const dbConf = fs.existsSync(path.resolve(__dirname, "./db.json"))
  ? require("./db.json")
  : {};

Object.assign(defaultConf.db, dbConf);
module.exports = defaultConf;

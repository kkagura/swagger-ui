const sequelize = require("../orm");
const uuid = require("uuid");

class BaseService {
  constructor(name) {
    this.name = name || "";
    this.orm = null;
    this.init();
  }
  init() {
    this.orm = sequelize.models[this.name] || null;
  }
  transaction(cb) {
    return sequelize.transaction(cb);
  }
  get(where) {
    return this.orm.extend.get(where);
  }
  getList(params) {
    return this.orm.extend.getList(params);
  }
  findAll(params) {
    return this.orm.findAll({ where: params });
  }
  add(params) {
    if (!params.id) {
      params.id = uuid.v4();
    }
    return this.transaction((t) => {
      return this.orm.extend.add(params, t);
    });
  }
  update(params, where) {
    return this.transaction((t) => {
      if (!where) {
        where = { id: params.id };
      }
      return this.orm.extend.update(params, where, t);
    });
  }
  delete(params) {
    return this.transaction((t) => {
      return this.orm.extend.delete(params, t);
    });
  }
}
module.exports = BaseService;

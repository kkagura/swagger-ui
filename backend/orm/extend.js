const { Op } = require("sequelize");

module.exports = function extend(orm) {
  const extendMethods = {
    get(where) {
      return orm.findOne({ where });
    },
    async getList({
      page = 1,
      pageSize = 10,
      where = {},
      include,
      through,
      order = [["createdAt", "DESC"]],
    }) {
      const offset = (page - 1) * pageSize;
      const records = await orm.findAll({
        limit: pageSize,
        offset,
        where,
        include,
        through,
        order,
      });
      const total = await orm.count({
        where,
      });
      return {
        page,
        pageSize,
        records,
        total,
      };
    },
    delete(where, t) {
      return orm.destroy({ where }, { transaction: t }).then(() => "ok");
    },
    add(data, t) {
      return orm.create(data, { transaction: t });
    },
    update(data, where, t) {
      if (!where) {
        const key = orm.primaryKeyField;
        where = {
          [key]: data[key],
        };
      }
      return orm.update(data, { where, transaction: t }).then(() => "ok");
    },
  };
  orm.extend = extendMethods;
};

module.exports = function extend(orm) {
  const extendMethods = {
    get(where) {
      return orm.findOne({ where });
    },
    async getList({ page = 1, pageSize = 10, where = {}, like = {} }) {
      const offset = (page - 1) * pageSize;
      const records = await orm.findAll({ limit: pageSize, offset, where });
      const total = await orm.count({ where });
      return {
        page,
        pageSize,
        records,
        total,
      };
    },
    delete(where, t) {
      return orm.destory({ where }, { transaction: t }).then(() => "ok");
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

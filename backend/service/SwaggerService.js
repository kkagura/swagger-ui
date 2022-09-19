const { request } = require("../utils");
const BaseService = require("./BaseService");
const { pinyin } = require("pinyin-pro");
const sequelize = require("../orm");
const { Op, QueryTypes } = require("sequelize");
class SwaggerService extends BaseService {
  async add(params) {
    const record = await this.orm.extend.get({ name: params.name });
    if (record) {
      throw {
        code: 500,
        message: "名称重复",
      };
    }
    if (params.name) {
      params.name2 = pinyin(params.name, {
        toneType: "none",
        type: "array",
      }).join("");
      params.name3 = pinyin(params.name, {
        toneType: "none",
        type: "array",
        pattern: "initial",
      }).join("");
    }
    return super.add(params);
  }
  async update(params) {
    const record = await this.orm.extend.get({ name: params.name });
    if (record && record.id !== params.id) {
      throw {
        code: 500,
        message: "名称重复",
      };
    }
    if (params.name) {
      params.name2 = pinyin(params.name, {
        toneType: "none",
        type: "array",
      }).join("");
      params.name3 = pinyin(params.name, {
        toneType: "none",
        type: "array",
        pattern: "initial",
      }).join("");
    }
    return super.update(params);
  }
  async getSwaggerDoc(id) {
    const record = await this.orm.extend.get({ id });
    if (!record) {
      throw {
        code: 1,
        message: "记录不存在",
      };
    }
    const { path } = record;
    return request(path).catch(
      () =>
        new Error({
          code: 1,
          message: "请求失败",
        })
    );
  }
  async getList(params) {
    const where = {};
    const { page = 1, pageSize = 10 } = params;
    const offset = (page - 1) * pageSize;
    const bind = {
      limit: pageSize + "",
      offset: offset + "",
    };
    let whereSql = "";
    if (params.nameLike) {
      whereSql +=
        " AND (swagger.name LIKE $nameLike OR swagger.name2 LIKE $nameLike OR swagger.name3 LIKE $nameLike) ";
      const nameLike = `%${params.nameLike}%`;
      bind.nameLike = nameLike;
      where[Op.or] = {
        name: nameLike,
        name2: nameLike,
        name3: nameLike,
      };
    }
    if (params.groupId) {
      whereSql += " AND swagger_group.id = $groupId ";
      bind.groupId = `${params.groupId}`;
      where[Op.and] = {
        groupId: params.groupId,
      };
    }
    const sql = `SELECT
    swagger.id as id,
    swagger.name as name,
    path,
    group_id AS groupId,
    swagger.createdAt,
    swagger.updatedAt ,
  swagger_group.name as groupName
  FROM
    swagger_config AS swagger INNER JOIN swagger_group on swagger.group_id = swagger_group.id
    WHERE 1=1 ${whereSql}
  ORDER BY
    swagger.createdAt DESC
    LIMIT $offset,
    $limit;`;
    const records = await sequelize.query(sql, {
      bind,
      type: QueryTypes.SELECT,
    });
    const total = await this.orm.count({ where });
    return {
      page,
      pageSize,
      records,
      total,
    };
    // return super.getList({
    //   ...params,
    //   where,
    //   include: { model: groupOrm, attributes: [["name", "group_name"]] },
    // });
  }
}

module.exports = SwaggerService;

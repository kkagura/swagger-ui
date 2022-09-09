const { request } = require("../utils");
const BaseService = require("./BaseService");
const { pinyin } = require("pinyin-pro");

class SwaggerService extends BaseService {
  add(params) {
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
  update(params) {
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
}

module.exports = SwaggerService;

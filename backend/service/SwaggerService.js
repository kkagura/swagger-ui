const { request } = require("../utils");
const BaseService = require("./BaseService");

class SwaggerService extends BaseService {
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

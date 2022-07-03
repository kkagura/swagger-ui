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
    //  fetch(path)
    return require("../config/swaggerTest.json");
  }
}

module.exports = SwaggerService;

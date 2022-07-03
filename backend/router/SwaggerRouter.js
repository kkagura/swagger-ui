const BaseRouter = require("./BaseRouter");

class SwaggerRouter extends BaseRouter {
  registerDefaults() {
    super.registerDefaults();
    this.register("/getSwaggerDoc", "post", this.getSwaggerDoc);
  }
  getSwaggerDoc(service) {
    return async (ctx, next) => {
      const id = ctx.request.body.id;
      const res = await service.getSwaggerDoc(id);
      ctx.success(res);
    };
  }
}
module.exports = new SwaggerRouter("swagger");

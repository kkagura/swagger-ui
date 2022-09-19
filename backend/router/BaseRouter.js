const Router = require("koa-router");
const conf = require("../config");
const getService = require("../service");
module.exports = class BaseRouter {
  constructor(name) {
    this.router = new Router();
    this.name = name;
    this.prefix = `/${conf.api.prefix}/${conf.api.version}/${this.name}`;
    this.router.prefix(this.prefix);
    this.service = getService(name);
    this.init();
  }
  init() {
    this.registerDefaults();
  }
  register(path, method, handler) {
    this.router[method](path, handler(this.service));
    console.log("注册路由：", `${this.prefix}${path}`);
  }
  get(service) {
    return async (ctx, next) => {
      const id = ctx.request.body.id;
      const res = await service.get({ id });
      ctx.success(res);
    };
  }
  list(service) {
    return async (ctx, next) => {
      const params = ctx.request.body;
      const res = await service.getList(params);
      ctx.success(res);
    };
  }
  add(service) {
    return async (ctx, next) => {
      const res = await service.add(ctx.request.body);
      ctx.success(res);
    };
  }
  update(service) {
    return async (ctx, next) => {
      const res = await service.update(ctx.request.body);
      ctx.success(res);
    };
  }
  delete(service) {
    return async (ctx, next) => {
      const res = await service.delete(ctx.request.body);
      ctx.success(res);
    };
  }
  findAll(service) {
    return async (ctx, next) => {
      const res = await service.findAll(ctx.request.body);
      ctx.success(res);
    };
  }
  registerDefaults() {
    this.register("/get", "post", this.get);
    this.register("/list", "post", this.list);
    this.register("/add", "post", this.add);
    this.register("/update", "post", this.update);
    this.register("/delete", "post", this.delete);
    this.register("/findAll", "post", this.findAll);
  }
};

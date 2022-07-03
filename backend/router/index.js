const compose = require("koa-compose");
const routers = [require("./SwaggerRouter")];
module.exports = function router() {
  const rs = [];
  routers.forEach(({ router }) =>
    rs.push(router.routes(), router.allowedMethods())
  );
  return compose(rs);
};

const BaseService = require("./BaseService");
const serviceMap = {
  swagger: require("./SwaggerService"),
  swaggerGroup: require("./BaseService"),
};

module.exports = function getService(modelName) {
  const Service = serviceMap[modelName] || BaseService;
  return new Service(modelName);
};

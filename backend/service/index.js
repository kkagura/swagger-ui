const BaseService = require("./BaseService");
const serviceMap = {
  swagger: require("./SwaggerService"),
};

module.exports = function getService(modelName) {
  const Service = serviceMap[modelName] || BaseService;
  return new Service(modelName);
};

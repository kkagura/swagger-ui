const undici = require("undici");

exports.request = function fetch(url) {
  return undici.request(url).then((res) => {
    return res.body.text().then((text) => {
      try {
        return JSON.parse(text);
      } catch (error) {
        return Promise.reject(new Error("不合法的JSON文件"));
      }
    });
  });
};

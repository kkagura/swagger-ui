const undici = require("undici");

exports.request = function fetch(url) {
  return undici.request(url).then((res) => {
    return res.body.text().then((text) => {
      try {
        return JSON.parse(text);
      } catch (error) {
        return Promise.reject(error);
      }
    });
  });
};

exports.isInt = function (num) {
  return parseInt(num) === parseFloat(num);
};

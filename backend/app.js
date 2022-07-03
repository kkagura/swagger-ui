const Koa = require("koa");
const routes = require("./router");
const cors = require("koa2-cors");
const koaBody = require("koa-body");
const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.log(error);
    const code = error.code || 1;
    const message = error.message || "服务器错误";
    ctx.body = { code, message, success: false };
  }
});

app.use(cors());
app.use(koaBody());

app.use(async (ctx, next) => {
  ctx.success = function (data) {
    ctx.body = { code: 0, data, success: true };
  };
  await next();
});

app.use(routes());

app.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});

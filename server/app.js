const Koa = require("koa");
const serve = require("koa-static");
const path = require("path");
const app = new Koa();
app.use(serve(path.join(__dirname, "..", "docs"), { extensions: ["html"] }));
app.listen(8080, function () {
  console.log("koa server running at port 8080");
});

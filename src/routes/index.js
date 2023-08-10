const authRouter = require("./auth");
const userRouter = require("./user");
const apiRouter = require("./api");
function route(app) {
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/api", apiRouter);
}
module.exports = route;

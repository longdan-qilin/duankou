// 导入express模块
const express = require("express");

// 创建express的服务器实例
const app = express();
const Joi = require("@hapi/joi");

// 创建cors跨域模块
const cors = require("cors");

// 给cors注册全局中间件
app.use(cors());
// 使用 express.static() 中间件，将 uploads 目录中的图片托管为静态资源：
app.use('./uploads',express.static('./uploads'))

// 导入配置文件
const expressJWT = require("express-jwt");
const config = require("./config");

// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件：
app.use(express.urlencoded({ extended: false }));

// 一定要在路由对象之前封装处理res.cc的函数   统一响应
app.use((req, res, next) => {
  // err可能是一个错误的对象也可能是一个错误的字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// 解析 token
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] })
);

// 导入并全局注册使用用户路由模块
const userRouter = require("./router/user");
app.use("/api", userRouter);
// 导入并使用用户信息的路由模块
const  userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
// 导入并使用文章分类的路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)
// 导入并使用文章路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

// 注册全局错误中间件
app.use((err, req, res, next) => {
  // 数据验证失败
  if (err instanceof Joi.ValidationError) return res.cc(err);
  // 捕获身份认证失败的错误
  if (err.name === "UnauthorizedError") return res.cc("身份认证失败！");
  // 未知错误
  res.cc(err);
});

// 调用app.listen() 方法 启动服务器
app.listen(80, () => console.log("express server running at http://127.0.0.1"));

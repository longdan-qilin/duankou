// 创建express模块
const express = require("express");
// 创建路由对象
const router = express.Router();
// 导入 @escook/express-joi中间件  检验验证规则
const expressJoi = require("@escook/express-joi");
//导入规则对象
const {userSchema} = require('../schema/user')
// 引入路由处理函数
const userHandler = require("../router_handle/user");


// 注册新用户  /reguser网址的前缀
router.post("/reguser",expressJoi(userSchema), userHandler.regUser);

// 登录
router.post("/login",expressJoi(userSchema), userHandler.login);

//将路由对象暴露出去
module.exports = router;

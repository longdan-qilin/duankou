// 创建express模块
const express = require("express");
// 创建路由对象
const router = express.Router();
// 导入multer 模块 解析 multipart/form-data 格式的请求体数据。
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
// 创建 multer 的实例对象 通过dest属性指定文件存放路径
const upload = multer({dest: path.join(__dirname,'../uploads')})
// 导入校验规则的模块
const expressJoi = require('@escook/express-joi')
// 导入规则对象
const {add_article_schema} = require('../schema/article')

// 导入发布文章路由处理函数
const arritcle_handel = require('../router_handle/article')

// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post('/add', upload.single('cover_img'),expressJoi(add_article_schema),arritcle_handel.addarticle)

// 向外暴露路由
module.exports = router
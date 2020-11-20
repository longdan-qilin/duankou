// 创建express模块
const express = require("express");
// 创建路由对象
const router = express.Router();
// 导入 @escook/express-joi中间件  检验验证规则
const expressJoi = require("@escook/express-joi");
//导入规则对象
const {
  add_cate_schema,
  delete_cate_schema,
  get_cate_schema,
  update_cate_schema
} = require("../schema/artcate");
// 导入文章分类的路由处理函数模块
const artcate_handler = require("../router_handle/artcate");

// 获取文章分类的列表数据
router.get("/cates", artcate_handler.getArticleCates);

// 新增文章分类的路由
router.post(
  "/addcates",
  expressJoi(add_cate_schema),
  artcate_handler.addArticleCates
);

// 删除文章分类的路由
router.get(
  "/deletecate/:id",
  expressJoi(delete_cate_schema),
  artcate_handler.deleteCateById
);

// 根据id获取文章分类的路由
router.get(
  "/cates/:id",
  expressJoi(get_cate_schema),
  artcate_handler.getArtCateById
);

// 根据 id 更新文章分类数据的路由
router.post(
  "/updatecate",
  expressJoi(update_cate_schema),
  artcate_handler.updateCateById
);

// 路由分享暴露出去
module.exports = router;

// 导入 joi 定义验证规则
const expressJoi = require("@escook/express-joi");
const Joi = require("@hapi/joi");

// 定义分类名称和分类别名的 校验规则
const name = Joi.string().required();
const alias = Joi.string().alphanum().required();
// 校验规则对象 添加分类
exports.add_cate_schema = {
  body: {
    name,
    alias,
  },
};

// 定义id 校验规则
const id = Joi.number().integer().min(1).required();
// 校验规则对象 根据id删除分类
exports.delete_cate_schema = {
  params: {
    id,
  },
};

// 根据id获取文章分类
exports.get_cate_schema = {
  params: {
    id,
  },
};

// 根据 id 更新文章分类数据
exports.update_cate_schema = {
  body: {
    Id: id,
    name,
    alias
  },
};

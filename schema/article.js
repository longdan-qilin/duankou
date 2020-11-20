// 导入 joi 定义验证规则
const Joi = require("@hapi/joi");

// 定义 标题、分类Id、内容、发布状态 的验证规则  integer()整数
const title = Joi.string().required()
const cate_id = Joi.number().integer().min(1).required()
const content = Joi.string().required().allow('')
const state = Joi.string().valid('已发布', '草稿').required()

exports.add_article_schema = {
    title,
    cate_id,
    content,
    state
}
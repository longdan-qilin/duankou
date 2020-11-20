// 导入数据库模块
const db = require("../db/index1");
// 导入处理路径的核心模块
const path = require("path");

exports.addarticle = (req, res) => {
  // 手动判断是是否上传了文章封面
  if (!req.file || req.file.fieldname !== "cover_img")
    return res.cc("文章封面是必选参数 ");
  // 整理要插入数据库的文章信息对象
  const articleInfo = {
    // 文章标题 文章id 文章内容 状态
    ...req.body,
    // 文章封面存放路径
    cover_img: path.join("/uploads", req.file.fieldname),
    // 文章发布时间
    pub_date: new Date(),
    // 文章的作者id
    author_id: req.user.id,
  };

  //  定义sql上传文章语句
  const sql = "insert into ev_articles set?";
  db.query(sql, articleInfo, (err, results) => {
    // sql语句执行失败
    if (err) return res.cc(err);
    // 影响行数不为1
    if(results.affectedRows !== 1) return res.cc('发布文章失败！')
    // 发布成功
    res.cc('发布文章成功！',0)
  });
};

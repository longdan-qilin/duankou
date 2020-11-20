// 导入数据库模块
const { releaseConnection } = require("../db/index1");
const db = require("../db/index1");

// 获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
  /* 执行sql语句 根据分类的状态，获取所有未被删除的分类列表数据 order by id asc=>id排序
    is_delete 为 0 表示没有被 标记为删除 的数据 */
  const sql = "select * from ev_article_cate where is_delete=0 order by Id asc";
  db.query(sql, (err, results) => {
    // 执行sql语句失败
    if (err) return res.cc(err);
    if (results.length === 0) return res.send({ status: 1, messgae: "为空" });
    // 执行sql语句成功
    res.send({
      status: 0,
      message: "获取文章分类列表成功！",
      data: results,
    });
  });
};

// 新增文章分类的路由处理函数
exports.addArticleCates = (req, res) => {
  // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
  const sql = "select * from ev_article_cate where  name=?  or alias=?";
  db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    // sql语句执行失败
    if (err) return res.cc(err);
    // 分类名称和分类别名 都被占用
    if (results.length === 2)
      return res.cc("分类名称和别名被占用，请更换重试！");
    if (
      results.length == 1 &&
      req.body.name === results[0].name &&
      req.body.alias === results[0].alias
    ) {
      return res.cc("分类名称和别名被占用，请更换重试！");
    }
    // 分类名称 或 分类别名 被占用
    if (results.length === 1 && req.body.name === results[0].name)
      return res.cc("分类名称被占用,请更换重试！");
    if (results.length === 1 && req.body.alias === results[0].alias)
      return res.cc("分类别名被占用,请更换重试！");
    const sql = "insert into ev_article_cate set ?";
    db.query(sql, req.body, (err, results) => {
      // sql语句执行失败
      if (err) return res.cc(err);
      // 受影响的 行数是否是一行
      if (results.affectedRows !== 1) return res.cc("新增文章分类失败！");
      // 响应成功
      res.cc("新增文章分类成功！", 0);
    });
  });
};

// 根据id删除文章分类的路由处理函数
exports.deleteCateById = (req, res) => {
  // 定义sql语句  标记删除
  const sql = "update ev_article_cate set is_delete=1 where Id=?";
  // 调用db.query()`
  db.query(sql, req.params.Id, (err, results) => {
    // sql语句执行失败
    if (err) return res.cc(err);
    // 删除的行数不超过1
    if (results.affectedRows !== 1) return res.cc("删除文章分类失败！");
    // 删除成功
    res.cc("删除文章分类成功！", 0);
  });
};

// 根据id获取文章分类的路由处理函数
exports.getArtCateById = (req, res) => {
  // 定义sql语句
  const sql = "select * from ev_article_cate where Id=?";
  console.log(sql);
  db.query(sql, req.params.Id, (err, results) => {
    console.log(results);
    // 执行sql语句失败
    if (err) return res.cc(err);
    // sql执行成功 但是没有查到任何数据
    if (results.length !== 1) return res.cc("获取文章分类数据失败！");
    // 执行成功
    res.send({
      status: 0,
      message: "获取文章分类数据成功",
      data: results[0],
    });
  });
};

// 根据 id 更新文章分类数据
exports.updateCateById = (req, res) => {
  // 定义sql语句 查询分类名称和分类别名是否被占用
  const sql =
    "select * from ev_article_cate where Id<>? and (name=? or alias=?)";
  // 执行sql语句
  db.query(
    sql,
    [req.body.Id, req.body.name, req.body.alias],
    (err, results) => {
      // 执行语句失败
      if (err) return res.cc(err);
      // 执行语句成功 分类名称和分类别名被占用
      if (results.length === 2)
        return res.cc("分类名称与别名被占用，请更换后重试！");
      if (
        results.length === 1 &&
        results[0].name === req.body.name &&
        results[0].alias === req.body.alias
      ) {
        return res.cc("分类名称与别名被占用，请更换后重试！");
      }
      // 分类名称 或 分类别名 被占用
      if (results.length === 1 && results[0].name === req.body.name) {
        return res.cc("分类名称被占用，请更换后重试！！");
      }
      if (results.length === 1 && results[0].alias === req.body.alias) {
        return res.cc("分类别名被占用，请更换后重试！");
      }
      // 定义更新文章分类数据
      const sql = "update ev_article_cate set ? where Id=?";
      db.query(sql, [req.body, req.body.Id], (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err);
        // 只能影响一行
        if (results.affectedRows !== 1) return res.cc("更新文章数据失败！");
        // 执行成功
        res.cc("更新文章数据成功", 0);
      });
    }
  );
};

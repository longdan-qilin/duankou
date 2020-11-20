// 导入数据库模块bd
const db = require("../db/index");
// 导入这个加密 bcryptjs 这个包
const bcryptjs = require("bcryptjs");

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  // 定义sql查询语句
  const sql =
    "select id, username, nickname, email, user_pic from ev_users where id=?";
  db.query(sql, req.user.id, (err, results) => {
    // 1.执行sql语句失败
    if (err) return res.cc(err);
    // 但是查询到的数据条数不等于 1  查询的结果可能为空
    if (results.length !== 1) return res.cc("获取用户信息失败！");
    // 3. 将用户信息响应给客户端
    res.send({
      status: 0,
      message: "获取用户基本信息成功！",
      data: results[0],
    });
  });
};

// 更新用户信息的处理函数
exports.updateUserInfo = (req, res) => {
  // 执行sql语句
  const sql = `update ev_users set ? where id=?`;
  // 调用db.query() 执行 SQL 语句并传参：
  db.query(sql, [req.body, req.body.id], (err, results) => {
    // 执行语句失败
    if (err) return res.cc(err);
    // 执行结果成功 但影响的行数不为1
    if (results.affectedRows !== 1) return res.cc("修改用户基本信息失败！");
    // 修改用户信息成功
    res.cc("修改用户基本信息成功！", 0);
  });
};

// 重置密码处理函数  req.user.id 是从token字符串获取的
exports.updatePassword = (req, res) => {
  const sql = "select * from ev_users where id=?";
  db.query(sql, req.user.id, (err, results) => {
    // 执行sql语句失败
    if (err) return res.cc(err);
    // 判断这个用户是否存在
    if (results.length !== 1) return res.cc("用户不存在！");
    // 如果用户存在 判断用户输入旧密码和数据库旧密码是否一致
    const compareResult = bcryptjs.compareSync(
      req.body.oldPwd,
      results[0].password
    );
    // 如果不一致 错误信息响应给客户端
    if (!compareResult) return res.cc("原密码错误！");
    // 对用户的新密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    const newPwd = bcryptjs.hashSync(req.body.newPwd, 10);
    // 如果一致 就把新密码更新到数据库中
    const sql = "update ev_users set password=? where id=?";
    db.query(sql, [newPwd, req.user.id], (err, results) => {
      // sql是否执行成功
      if (err) return res.cc(err);
      // 受影响的行数是否是一行
      if (results.affectedRows !== 1) return res.cc("更新密码失败！");
      // 更新成功
      res.cc("更新密码成功！", 0);
    });
  });
};

// 更新头像的处理函数
exports.updateAvatar = (req, res) => {
  // 定义sql语句
  const sql = "update ev_users set user_pic=?  where id=?";
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    // sql语句执行错误
    if (err) return res.cc(err);
    // 只能影响一行
    console.log(results);
    if (results.affectedRows !== 1) return res.cc("修改头像失败！");
    // 修改成功
    res.cc("修改头像成功！", 0);
  });
};

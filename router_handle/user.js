// 为了保证 路由模块  的纯粹性 所有的路由处理函数 都要抽离到对应的 路由处理函数模块
// 导入数据库模块
const db = require("../db/index");
// 导入这个加密 bcryptjs 这个包
const bcryptjs = require("bcryptjs");
// 用这个包来生成 Token 字符串
const jwt = require("jsonwebtoken");
// 导入全局的配置文件
const config = require("../config");

// 注册用户的处理函数 exports对象分享出去
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器的信息
  const userinfo = req.body;
  // 检验用户名是否被占用
  // 定义sql语句
  const sql = "select * from ev_users where username=?";
  // 执行sql语句且判断用户名是否被占用
  db.query(sql, [userinfo.username], (err, result) => {
    // console.log(1);
    // 执行sql语句失败
    if (err) {
      // return res.send({ status: 1, message: err.message });
      return res.cc(err);
    }
    // 用户名被占用
    if (result.length > 0) {
      // return res.send({
      //   status: 1,
      //   message: "用户名被占用，请更换其他用户名！",
      // });
      return res.cc("用户名被占用，请更换其他用户名！");
    }
    // TODO: 用户名可用，继续后续流程...
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    userinfo.password = bcryptjs.hashSync(userinfo.password, 10);

    // HODO:  插入新用户
    // 定义插入用户的sql语句
    const sql = "insert into ev_users set ?";
    //执行插入用户的sql语句
    db.query(
      sql,
      { username: userinfo.username, password: userinfo.password },
      (err, result) => {
        // 执行sql语句失败
        // if (err) return res.send({ status: 1, message: err.message });
        if (err) return res.scc(err);

        // sql语句执行成功  但是影响行数不为1
        if (result.affectedRows !== 1)
          return res.cc("注册用户失败，请重新再试!");
        // return res.send({ status: 1, message: "注册用户失败，请重新再试!" });

        // 注册成功
        // res.send({ status: 0, message: "注册成功!" });
        res.cc("注册成功！", 0);
      }
    );
  });
};

// 登录
exports.login = (req, res) => {
  const userinfo = req.body;
  // 定义查询sql语句
  const sql = `select * from ev_users where username=?`;
  db.query(sql, userinfo.username, (err, results) => {
    // 执行sql语句失败
    // if (err) return res.cc(err);
    // 执行 SQL 语句成功，但是查询到数据条数不等于 1   用户名不能被占用
    if (results.length !== 1) return res.cc("登录失败！");
    // TODO：判断用户输入的登录密码是否和数据库中的密码一致
    const compareResult = bcryptjs.compareSync(
      userinfo.password,
      results[0].password
    );

    if (!compareResult) return res.cc("密码错误，登陆失败！");
    //剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
    const user = { ...results[0], password: "", user_pic: "" };
    // 生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: "10h", // token 有效期为 10 个小时
    });

    res.send({
      status: 0,
      message: "登录成功！",
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: "Bearer " + tokenStr,
    });
  });
};

//将暴露出去  exports 相当于module.exports 所以已经暴露出去了不用写
// module.exports = exports

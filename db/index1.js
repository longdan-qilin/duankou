// 引入mysql模块
const mysql = require('mysql')

// 建立与mysql的连接关系
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'my_db_01',
})

// 向外暴露db的数据库连接对象
module.exports = db
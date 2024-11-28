const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "dev241101!@34",
  database: "test",
  port: 3307, //집에서 MAriaDB port설정충돌때문에 임시로 설정했습니다.
});

module.exports = db;

const express = require("express");
const app = express();
const mysql = require("mysql");
const PORT = process.env.port || 8000;

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "dev241101!@34",
  database: "test",
});

app.get("/", (req, res) => {
  const sqlQuery = "INSERT INTO requested (rowno) VALUES (1)";
  db.query(sqlQuery, (err, result) => {
    res.send("Success!!");
  });
  console.log("Request received");
});

// TODO: DB테스트는완료 하지만 index외 다른곳에서 export해야하는지 확인할것, passport로 로그인 작업하기 회원가입은 그후에,
app.get("/testmys", (req, res) => {
  const sqlQuery = "INSERT INTO board VALUES (6,'뭐지','ㅋㅋ',0,'흐림','2024-11-24',NULL,false,'aaa@aaa.com','192.000.111.111',NULL)";
  
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error");
    }

    console.log('DB INSERT');
    res.send("Data inserted successfully!"); // 성공 메시지 전송
  });
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});

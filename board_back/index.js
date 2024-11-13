const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.port || 8080;

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:3000", // 클라이언트의 도메인
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(bodyParser.json());

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

app.post("/api/posts", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  const sqlQuery =
    "INSERT INTO board (title, contents, views, weather, publish_date, email, ip_location) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sqlQuery,
    [title, content, 0, "맑음", new Date(), "aaa@aaa.com", "200.200.1.1"],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      } else {
        res.send("Success!!");
      }
    }
  );

  console.log("Request received");
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});

const express = require("express");
const { swaggerUI, swaggerDocs } = require("./modules/swagger");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.port || 8000;

// TODO: SWAGGER 설정 추가하기(20241114 kwc)
// TODO: 게시물 상세 조회 API 추가하기(20241114 kwc)
// CORS 설정
app.use(
  cors({
    origin: "http://localhost:3000", // 클라이언트의 도메인
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// swagger UI 설정
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

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

// 게시물 리스트 조회
/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: 게시물 리스트 조회
 *     tags:
 *     - API Sample
 *     description: 게시물 전체 리스트를 조회합니다
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/api/posts", (req, res) => {
  const sqlQuery =
    "SELECT board_id, title, views, publish_date, email FROM board ORDER BY publish_date DESC";
  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    } else {
      if (results.length === 0) {
        return res.status(404).send("No data found");
      }
      res.json(results);
    }
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
  // 서버 실행 후 명세서를 확인할 수 있는 URL
  console.log("Swagger docs available at http://localhost:8000/api-docs");
});

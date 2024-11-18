require("dotenv").config(); // .env파일 읽기
const express = require("express");
const { swaggerUI, swaggerDocs } = require("./modules/swagger");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./config/db");
const app = express();
const PORT = process.env.port || 8000;
const passport = require("./config/passport");
const authRouter = require("./routes/authRouter");

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
app.use(passport.initialize());
app.use(bodyParser.json());

//라우팅 별도 파일로 분리
app.use("/api/auth", authRouter);

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

/**
 * @swagger
 * /api/posts/{board_id}:
 *   get:
 *     summary: 게시물 상세 조회
 *     tags:
 *     - 게시판 API
 *     description: 게시물 상세 데이터를 조회합니다
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: board_id
 *       in: path
 *       description: 게시물 ID
 *       schema:
 *          type: integer
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/api/posts/:board_id", (req, res) => {
  const board_id = req.params.board_id;
  const sqlQuery = "SELECT * FROM board WHERE board_id = ?";
  db.query(sqlQuery, [board_id], (err, results) => {
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

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
  // 서버 실행 후 명세서를 확인할 수 있는 URL
  console.log("Swagger docs available at http://localhost:8000/api-docs");
});

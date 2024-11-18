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
const boardRouter = require("./routes/boardRouter");

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
app.use("/api/board", boardRouter);

app.get("/", (req, res) => {
  const sqlQuery = "INSERT INTO requested (rowno) VALUES (1)";
  db.query(sqlQuery, (err, result) => {
    res.send("Success!!");
  });
  console.log("Request received");
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
  // 서버 실행 후 명세서를 확인할 수 있는 URL
  console.log("Swagger docs available at http://localhost:8000/api-docs");
});

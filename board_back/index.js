require("dotenv").config(); // .env파일 읽기
const express = require("express");
const session = require('express-session');
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

//json사용
app.use(bodyParser.json());

// 로그인 세션 설정
app.use(
  session({
    name: 'dev_session_cookie',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, //세션이 변경되지 않아도 매요청시 저장되는옵션 비효율적이기때문에 권장되지않음
    cookie: {
      httpOnly: true,
      secure: false, // 개발 환경에서는 HTTPS가 아니므로 false
      sameSite: 'lax', // 크로스 도메인 허용: 'lax', 'strict', 'none'
      maxAge: 1 * 60 * 60 * 1000, // 1시간(ms) 동안 쿠키 유지됨, 만료시 브라우저에서 자동으로 삭제됨
    },
  })
);

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session()); // Passport 세션 연결


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

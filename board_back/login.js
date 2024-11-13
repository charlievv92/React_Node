const express = require("express");
const app = express();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const PORT = process.env.PORT || 8000;

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "dev241101!@34",
  database: "test",
});

// JSON 요청을 처리할 수 있도록 설정
app.use(express.json());

// 로그인 요청을 처리하는 엔드포인트
app.post("/login", (req, res) => {
  const { email, password } = req.body; // 클라이언트에서 보낸 이메일과 비밀번호

  // 이메일과 비밀번호로 DB에서 사용자 조회
  const sqlQuery = "SELECT * FROM user WHERE email = ?";
  
  db.query(sqlQuery, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error");
    }

    // 결과가 없으면 로그인 실패
    if (result.length === 0) {
      return res.status(401).send("이메일 혹은 비밀번호가 잘못되었습니다.");
    }

    // DB에서 받은 사용자 데이터
    const user = result[0];

    // 비밀번호 비교 (bcrypt를 사용한 해싱된 비밀번호 비교)
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).send("Error comparing password");
      }
      if (!isMatch) {
        return res.status(401).send("이메일 혹은 비밀번호가 잘못되었습니다.");
      }

      // 로그인 성공 시 JWT 발급 (예시)
      // const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

      res.send("Login successful");
    });
  });

  console.log("Login request received");
});


// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

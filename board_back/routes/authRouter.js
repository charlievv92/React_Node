const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const bcrypt = require('bcrypt');
const saltRounds = 10; // 해싱 라운드: 높을수록 보안 강하지만 속도 저하 있음

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인 요청
 *     description: 로그인폼에서 입력한 이메일, 패스워드로 로그인 요청을 처리합니다.
 *     tags: 
 *        - Auth
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: 
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       401:
 *         description: 이메일 혹은 비밀번호 잘못됨
 *       500:
 *         description: 서버 오류
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sqlQuery = 'SELECT * FROM user WHERE email = ?';
  db.query(sqlQuery, [email], async (err, result) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    if (result.length === 0) {
      return res.status(401).send('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
    // DB에서찾은 사용자정보
    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      return res.status(401).send('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // JWT 생성 (1시간 유효)
    const token = jwt.sign(
      {
        // 토큰에 포함할 사용자 데이터
        email: user.email,
        userName: user.user_name,
        authCode: user.auth_code
      },
      process.env.JWT_SECRET, // 비밀키 (환경 변수로 관리)
      { expiresIn: '30s' } // 토큰 유효 기간 s, m, h, d 현재 테스트용으로 30초 유지
    );

    // 로그인 성공 토큰전송
    res.status(200).json({
      message: 'Login successful',
      token: token,
    });
  });
});


/**
 * @swagger
 * /api/auth/ip:
 *   get:
 *     summary: IP주소 반환
 *     description: 클라이언트의 IP주소를 반환합니다.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: 클라이언트 IP주소가 성공적으로 반환됨.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ip:
 *                   type: string
 *                   example: "127.0.0.1"
 */
router.get('/ip', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  res.json({ ip: clientIp });
});

/**
 * @swagger
 * /api/auth/emailDuplicated:
 *   post:
 *     summary: 이메일 중복검사
 *     description: 이미 가입되어있는 이메일인지 확인합니다.
 *     tags: 
 *        - Auth
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: 
 *                 type: string
 *                 example: "user@example.com"
 *               
 *     responses:
 *       200:
 *         description: 중복되지않음
 *       401:
 *         description: 중복된이메일
 *       500:
 *         description: 서버 오류
 */
router.post('/emailDuplicated', (req, res) => {
  const { email } = req.body;
  const sqlQuery = 'SELECT * FROM user WHERE email = ?';

  db.query(sqlQuery, [email], (err, result) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    if (result.length > 0) {
      return res.status(401).send('중복된 이메일');
    }
    res.status(200).send('중복되지 않음');
  });
});


/**
 * @swagger
 * /api/auth/signinUser:
 *   post:
 *     summary: 회원가입
 *     description: 회원가입을 진행합니다 INSERT
 *     tags: 
 *        - Auth
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: 
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "passwordmin6"
 *               name:
 *                 type: string
 *                 example: "김철수"
 *               phone:
 *                 type: string
 *                 example: "010-1234-5678"
 *               addr1:
 *                 type: string
 *                 example: "경기도 수원시 영통구 123"
 *               addr2:
 *                 type: string
 *                 example: "101동 101호"
 *     responses:
 *       200:
 *         description: 회원가입 성공
 *       401:
 *         description: 중복된이메일
 *       500:
 *         description: 서버 오류
 */
router.post('/signinUser', async  (req, res) => {
  const { email, password, name, phone, addr1, addr2 } = req.body;

  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //date_of_joining은 현재시간 auth_code는 기본값으로 설정
    const sqlQuery = `
      INSERT INTO user (email, password, user_name, tel_number, address, address_detail, date_of_joining, auth_code)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE(), 'T0')
      `;

    db.query(
      sqlQuery,
      [email, hashedPassword, name, phone, addr1, addr2],
      (err, result) => {
        if (err) {
          // 중복된 이메일 처리
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(401).send('이미 존재하는 이메일입니다.');
          }
          // 기타 오류 처리
          return res.status(500).send('서버 오류: ' + err.message);
        }

        // 성공 응답
        res.status(200).send('회원가입 성공');
      }
    );
  } catch (error) {
    // 비동기 로직에서 발생한 에러 처리
    console.error(error);
    res.status(500).send('서버 오류: 비밀번호 암호화 실패');
  }
});



/**
 * @swagger
 * /api/auth/testPass:
 *   post:
 *     summary: 비밀번호 해싱 및 비교 테스트
 *     description: 입력된 비밀번호와 데이터베이스의 해싱된 비밀번호를 비교합니다.
 *     tags: 
 *        - Auth
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: 
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "passwordmin6"
 *     responses:
 *       200:
 *         description: 비밀번호 일치
 *       401:
 *         description: 이메일이 없거나 비밀번호가 일치하지 않음
 *       500:
 *         description: 서버 오류
 */
router.post('/testPass', async (req, res) => {

  const { email, password } = req.body;
  const sqlQuery = "SELECT password FROM user WHERE email = ?";
  try{
    db.query(sqlQuery, [email], async (err, result) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).send('서버 오류');
      }

      if (result.length === 0) {
        // 이메일이 존재하지 않는 경우
        return res.status(401).send('이메일을 찾을 수 없습니다.');
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds); // 입력한거 암호화
      const dbpass = result[0].password; // 데이터베이스에서 가져온 해싱된 비밀번호

      // 입력된 비밀번호와 DB의 해싱된 비밀번호 비교
      const isMatch = await bcrypt.compare(password, dbpass);

      console.log('입력 비밀번호:', password);
      console.log('그걸 암호화함:', hashedPassword)
      console.log('DB에 저장된 해시 비밀번호:', dbpass);
      console.log('비밀번호 일치 여부:', isMatch);

      if (isMatch) {
        res.status(200).send('비밀번호가 일치합니다.');
      } else {
        res.status(401).send('비밀번호가 일치하지 않습니다.');
      }
    });
  }catch(error) {
    console.error(error);
  }

  
});


module.exports = router;
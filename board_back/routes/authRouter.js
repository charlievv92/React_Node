const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');

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

  const sqlQuery = 'SELECT * FROM user WHERE email = ? AND password = ?';
  db.query(sqlQuery, [email, password], (err, result) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    if (result.length === 0) {
      return res.status(401).send('이메일혹은 비밀번호가 잘못되었습니다.');
    }
    // DB에서찾은 사용자정보
    const user = result[0];

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
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.json({ ip: clientIp });
});

/**
 * @swagger
 * /api/auth/jwt-authTest:
 *  get:
 *    summary: JWT테스트
 *    description: 로그인한, JWT토큰이 있는사람만 접속가능한 주소입니다.
 *    tags: 
 *        - Auth
 */
router.get('/jwt-authTest',passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('로그인중이시군요');
});




module.exports = router;
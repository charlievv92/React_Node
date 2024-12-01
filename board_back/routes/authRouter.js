const express = require('express');
const router = express.Router();
const db = require('../config/db');
const passport = require('../config/passport');
const bcrypt = require('bcrypt');
const redisClient = require('../modules/redisClient');
const saltRounds = 10; // 해싱 라운드: 높을수록 보안 강하지만 속도 저하 있음

//관리자 확인
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.auth_code === 'SC') {//TODO:이부분은 추후 협의된 관리자 코드로 변경
    return next(); // 관리자 접근 허용
  }
  return res.status(403).json({ message: '권한 오류.' }); // 접근 차단
}


router.get('/admin', isAdmin, (req, res) => {
  res.send('관리자 페이지접속');
});

//관리자 계정 생성용, auth_code에 위에 관리자값 넣고 할것
/**
 * @swagger
 * /api/auth/adminadd:
 *   post:
 *     summary: 어드민 계정 생성
 *     description: 어드민 계정 생성.
 *     tags: 
 *        - Auth
 */
router.post('/adminadd', async  (req, res) => {

  try {
    const hashedPassword = await bcrypt.hash('123456', saltRounds);

    //date_of_joining은 현재시간 auth_code는 기본값으로 설정
    const sqlQuery = `
      INSERT INTO user (email, password, user_name, tel_number, address, address_detail, date_of_joining, auth_code)
      VALUES ('ad123@te.st', ?, '어드민', 'TEST', 'TEST', 'TEST', '2001-01-01', 'SC')
      `;

    db.query(
      sqlQuery,
      [hashedPassword],
      (err, result) => {
        if (err) {
          // 중복된 이메일 처리
          if (err.code === 'ER_DUP_ENTRY') {
            console.log('관리자 이미 있음');
          }
          // 기타 오류 처리
          console.log(err.message);
        }

        // 성공 응답
        console.log('관리자생성');
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
router.post('/login', (req, res, next) => {
  
  if (req.isAuthenticated()) {
    return res.status(200).json({
      message: "이미 로그인된 상태입니다.",
      user: {
        email: req.user.email,
        userName: req.user.user_name,
        authCode: req.user.auth_code,
      },
    });
  }
  
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).send('서버 오류: ' + err.message);
    }
    if (!user) {
      return res.status(401).send(info.message || '이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // 세션 생성
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).send('세션 생성 실패');
      }


      res.status(200).json({
        message: '로그인 성공',
        user: {
          email: user.email,
          userName: user.user_name,
          authCode: user.auth_code,
        },
      });
    });
  })(req, res, next);
});


/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 로그아웃 요천
 *     description: 로그인된 사용자의 세션을 종료하고 쿠키를 삭제합니다.
 *     tags: 
 *       - Auth
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *       500:
 *         description: 서버 오류 또는 로그아웃 실패
 */
router.post('/logout', (req, res) => {
  // Passport 로그아웃 처리
  req.logout((err) => {
    if (err) {
      return res.status(500).send('로그아웃 처리 실패');
    }
    // 세션 삭제
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('세션 삭제 실패');
      }
      // 클라이언트 쿠키 삭제
      res.clearCookie('connect.sid'); // 세션 쿠키 이름과 동일해야 함
      res.status(200).send('로그아웃 성공');
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
 * /api/auth/status:
 *   get:
 *     summary: 로그인 상태 확인
 *     description: 현재 로그인 상태를 반환합니다.
 *     tags: 
 *        - Auth
 *     responses:
 *       200:
 *         description: 로그인 상태 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loggedIn:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     authCode:
 *                       type: string
 */
router.get('/status', (req, res) => {
  // Passport를 통해 인증(로그인)된 사용자인지 확인
  if (req.isAuthenticated()) {
    // 인증된 사용자 정보 반환
    res.status(200).json({
      user: {
        email: req.user.email,
        userName: req.user.user_name,
        authCode: req.user.auth_code,
      },
    });
  } else {
    // 인증되지 않은 상태
    res.status(200).json({
      user:null
    });
  }
});




module.exports = router;
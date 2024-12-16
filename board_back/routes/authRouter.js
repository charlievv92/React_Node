const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const bcrypt = require('bcrypt');
const saltRounds = 10; // 해싱 라운드: 높을수록 보안 강하지만 속도 저하 있음

const { //db객체
  queryAsync,
  create,
  read,
  update,
  remove,
} = require("../utils/dbUtils");

//관리자 확인
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.auth_code === 'SC') {
    return next(); // 관리자 접근 허용
  }
  return res.status(403).json({ message: '권한 오류.' }); // 접근 차단
}
router.get('/admin', isAdmin, (req, res) => {
  res.send('관리자 페이지접속');
});


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
    await create('user',{
      email:'ad123@te.st',
      password:hashedPassword,
      user_name:'어드민',
      tel_number:'TEST',
      address:"TEST",
      address_detail:"TEST",
      date_of_joining:'2001-01-01',
      auth_code:'SC'
    });
    res
      .status(200)
      .json({ code: 200, message: "관리자 생성됨" });
    
  } catch (error) {

    if (error.code === 'ER_DUP_ENTRY') {
      console.log('에러 : 관리자가 이미 등록되어있음.');
      return res.status(400).json({ code: 400, message: '관리자가 이미 등록되어있음.' });
    }

    console.error('오류 : ', error);
    res.status(500).json({ code: 500, message: '서버 오류: 관리자 생성 실패' });
  }
});

/**
 * @swagger
 * /api/auth/userList:
 *   get:
 *     summary: 유저목록 반환(관리자 제외)
 *     description: 가입된 유저 목록을 반환합니다. (관리자 제외)
 *     tags: 
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성공적으로 유저 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: user@example.com
 *                   user_name:
 *                     type: string
 *                     example: 홍길동
 *                   date_of_joining:
 *                     type: string
 *                     format: date
 *                     example: 2023-12-01
 *                   auth_code:
 *                     type: string
 *                     example: T0
 *                   is_deleted:
 *                     type: boolean
 *                     example: false
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
router.get('/userList' , async (req, res) => {

  const sqlQuery = `SELECT email, user_name, date_of_joining, auth_code, is_deleted FROM user WHERE auth_code!='A0'`;
  try{
    const data = await queryAsync(sqlQuery,[]);
    res.status(200).json({ code: 200, data: data });
  }catch(error){
    res.status(500).json({ code: 500, message: '서버 오류: 목록읽기 실패' });
  }

});




router.post('/userUpdateByAdmin' , async (req, res) => {
  
  const { action, selectedUsers } = req.body;
  
  if (!action || !selectedUsers || selectedUsers.length === 0) {
    return res.status(400).json({ message: "action 또는 selectedUsers가 누락되었습니다." });
  }

  var sqlQuery ='';
  const queryValues = [selectedUsers];

  switch (action) {
    case "delete":
      sqlQuery = `UPDATE user SET is_deleted = 1 WHERE email IN (?)`;
      break;

    case "restore":
      sqlQuery = `UPDATE user SET is_deleted = 0 WHERE email IN (?)`;
      break;

    case "updateAuth":
      // 권한 변경 (예: 모든 선택된 사용자의 권한을 'T1'로 변경)
      sqlQuery = `UPDATE user SET auth_code = 'T1' WHERE email IN (?)`;
      break;

    default:
      return res.status(400).json({ message: "유효하지 않은 action입니다." });
  }


  try{
    await queryAsync(sqlQuery, queryValues);
    res.status(200).json({ code: 200, message: '유저 정보 변경 성공'});
  }catch(error){
    res.status(500).json({ code: 500, message: '오류: 변경 실패' });
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
        message: "로그인 성공",
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
 *     summary: 로그아웃 요청
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
router.post('/emailDuplicated', async (req, res) => {
  const table = 'user';
  const columns = 'email';
  const { email } = req.body;
  try{
    const result = await read(table,columns,{email:email});
    if (result.length > 0) {
      return res.status(401).json({code: 401, message: '중복된 이메일'});
    }
    res.status(200).json({ code: 200, message: '중복되지않음'});
  }catch(err){

    res.status(500).json({ code: 500, message: '오류: 변경 실패' });
  }

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
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE(), 'N0')
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
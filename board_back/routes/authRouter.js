const express = require("express");
const knex = require("../config/knex");
const router = express.Router();
const passport = require("../config/passport");
const bcrypt = require("bcryptjs");
const saltRounds = 10; // 해싱 라운드: 높을수록 보안 강하지만 속도 저하 있음

const {
  //db객체
  queryAsync,
  create,
  read,
  update,
  remove,
} = require("../utils/dbUtils");
const {
  createResponse,
  successResponse,
  clientErrorResponse,
  dataNotFoundErrorResponse,
  serverErrorResponse,
} = require("../utils/responseUtils");
const e = require("express");


/**
 * @swagger
 * /api/auth/users-ad:
 *   get:
 *     summary: 유저 목록 반환 (관리자 제외)
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
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: user@example.com
 *                       user_name:
 *                         type: string
 *                         example: 홍길동
 *                       date_of_joining:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-12-01T15:00:00.000Z"
 *                       auth_code:
 *                         type: string
 *                         example: T0
 *                       is_deleted:
 *                         type: integer
 *                         example: 0
 *                 message:
 *                   type: string
 *                   example: "Success"
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 *   put:
 *     summary: 유저 정보 업데이트
 *     description: 선택된 유저의 정보를 업데이트합니다. (삭제, 복원, 권한 변경)
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [delete, restore, updateAuth]
 *                 example: delete
 *               selectedUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: user@example.com
 *     responses:
 *       200:
 *         description: 유저 정보 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "유저 정보 변경 성공"
 *       400:
 *         description: action 또는 selectedUsers가 누락되었습니다.
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
router.get("/users-ad" , async (req, res) => {

  //TODO: 어드민 관련 api사용시 권한 확인 추가할것
  try{
    const data = await knex
      .select('email', 'user_name', 'date_of_joining', 'auth_code', 'is_deleted')
      .from('user');
      //TODO: 관리자 페이지에서 유저목록 보는요청인데 관리자이외만 표시하도록 추후 조건 변경
      //.where('auth_code', '!=', 'SC');
    return res.json(successResponse(data));
  }catch(error){
    return res.json(serverErrorResponse('서버 오류: 목록읽기 실패'));
  }

});

//TODO: patch로 수정
router.put("/users-ad", async (req, res) => {
  const { action, selectedUsers } = req.body;
  console.log(selectedUsers);
  if (!action || !selectedUsers || selectedUsers.length === 0) {
    return res.json(clientErrorResponse("action 또는 selectedUsers가 누락되었습니다."));
  }

  var data = {};

  switch (action) {
    case "delete":
      data= {is_deleted:1};
      break;

    case "restore":
      data= {is_deleted:0};
      break;

    case "updateAuth":
      //권한이 N0(일반회원)이면 관리자로 A0(관리자)면 일반회원으로
      try {

        await knex('user')
          .update({
            auth_code: knex.raw(`CASE 
              WHEN auth_code = 'N0' THEN 'A0' 
              WHEN auth_code = 'A0' THEN 'N0' 
              ELSE auth_code 
            END`)
          })
          .whereIn('email', selectedUsers);
        return res.json(successResponse('유저 정보 변경 성공'));

      } catch (error) {
        console.error('Error updating auth_code:', error);
        return res.json(serverErrorResponse('오류: 변경 실패'));
      }

    default:
      return res.json(clientErrorResponse("유효하지 않은 action입니다."));
  }


  try{
    await knex('user').update(data).whereIn('email',selectedUsers);
    return res.json(successResponse('유저 정보 변경 성공'));
  }catch(error){
    return res.json(serverErrorResponse('오류: 변경 실패'));
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
router.post("/login", (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.json(clientErrorResponse('이미로그인되어있음'));
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.json(serverErrorResponse('서버 오류: ' + err.message));
    }
    if (!user) {
      return res.json(clientErrorResponse(info.message || '이메일 또는 비밀번호가 일치하지 않습니다.'));
    }

    // 세션 생성
    req.logIn(user, (err) => {
      if (err) {
        return res.json(serverErrorResponse('세션 생성 실패'));
      }
      const data = {
        user: 
          {
            email: user.email,
            userName: user.user_name,
            authCode: user.auth_code,
        
          }
      }
      res.json(successResponse(data, '로그인 성공'))
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
router.post("/logout", (req, res) => {
  // Passport 로그아웃 처리
  req.logout((err) => {
    if (err) {
      return res.json(serverErrorResponse('로그아웃 처리 실패'));
    }
    // 세션 삭제
    req.session.destroy((err) => {
      if (err) {
        return res.json(serverErrorResponse('세션 삭제 실패'));
      }
      // 클라이언트 쿠키 삭제
      res.clearCookie('connect.sid'); // 세션 쿠키 이름과 동일해야 함
      return res.json(successResponse('로그아웃 성공'));
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
  return res.json({ ip: clientIp });
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
router.post("/emailDuplicated", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await knex.select('email').from('user').where('email',email);
    if (result.length > 0) {
      return res.json(clientErrorResponse('중복된 이메일'));
    }
    return res.json(successResponse('중복되지않음'));
  } catch(err) {
    console.log(err);
    return res.json(serverErrorResponse('오류: 변경 실패'));
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
router.post("/signinUser", async (req, res) => {
  const { email, password, name, phone, addr1, addr2 } = req.body;
  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await knex('user').insert({
      email: email,
      password: hashedPassword,
      user_name: name,
      tel_number: phone,
      address: addr1,
      address_detail: addr2,
      date_of_joining: knex.fn.now(), // 현재 시간
      auth_code: 'N0', // 기본값
      is_deleted: 0 // 기본값
    })

    return res.json(successResponse('회원가입 성공'));

  } catch (error) {

    if (error.code === 'ER_DUP_ENTRY') {
      return res.json(clientErrorResponse('이미 존재하는 이메일입니다.'));
    }
    // 비동기 로직에서 발생한 에러 처리
    console.error(error);
    return res.json(serverErrorResponse('서버 오류: 비밀번호 암호화 실패'));
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
router.get("/status", (req, res) => {
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
      user: null,
    });
  }
});

module.exports = router;

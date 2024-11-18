const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('./db');

// JWT 옵션 설정
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization 헤더에서 토큰 추출
  secretOrKey: process.env.JWT_SECRET, // 토큰 서명에 사용할 시크릿 키
};

// JWT 전략 정의
const jwtVerify = async (jwtPayload, done) => {
  try {
    // JWT의 payload에서 사용자 email 추출
    const email = jwtPayload.email;

    // DB에서 사용자 확인
    db.query('SELECT * FROM user WHERE email = ?', [email], (err, result) => {
      if (err) {
        return done(err, false);
      }
      if (result.length === 0) {
        return done(null, false); // 사용자 없음
      }
      const user = result[0];
      return done(null, user); // 사용자 정보 전달
    });
  } catch (err) {
    done(err, false);
  }
};

// JWT 전략을 Passport에 등록
passport.use(new JwtStrategy(jwtOptions, jwtVerify));

module.exports = passport;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db');

// Passport LocalStrategy 설정
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    const sqlQuery = 'SELECT * FROM user WHERE email = ?';
    db.query(sqlQuery, [email], async (err, results) => {
      if (err) return done(err);
      if (results.length === 0) {
        return done(null, false, { message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
      }

      return done(null, user); // 인증 성공
    });
  })
);

// 세션 직렬화
passport.serializeUser((user, done) => {
  done(null, user.email); // 사용자 email만 세션에 저장됨
});

// 세션 역직렬화
passport.deserializeUser((email, done) => {
  const sqlQuery = 'SELECT * FROM user WHERE email = ?';
  db.query(sqlQuery, [email], (err, results) => {
    if (err) return done(err);
    if (results.length === 0) return done(null, false);
    return done(null, results[0]); // 세션에서 사용자 정보 복원
  });
});

module.exports = passport;

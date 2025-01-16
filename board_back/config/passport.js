const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const knex = require("../config/knex");


// Passport LocalStrategy 설정
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    
    try{
      const result = await knex.select('email','password','is_deleted').from('user').where('email',email);

      //이메일로 유저조회 실패
      if (result.length === 0) {
        return done(null, false, { message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
      }
      const user = result[0];

      //password일치 확인
      const isMatch = await bcrypt.compare(password, user.password); 

      //패스워드 틀릴경우
      if (!isMatch) {
        return done(null, false, { message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
      }

      //정지상태일경우
      if (user.is_deleted){
        return done(null, false, { message: '계정이 정지된 상태입니다 관리자에 문의하세요'});
      }
      
      //인증성공
      return done(null, user);

    } catch (error) {
      console.error('DB오류', error); 
      return done(error);
    }

  })

);

// 세션 직렬화
passport.serializeUser((user, done) => {
  done(null, user.email); // 사용자 email만 세션에 저장됨
});

// 세션 역직렬화
passport.deserializeUser(async (email, done) => {
  try {
    const result = await knex.select('*').from('user').where('email', email);
    
    if (result.length === 0) {
      return done(null, false); // 사용자가 존재하지 않으면 false 반환
    }
    
    return done(null, result[0]); // 사용자 정보를 성공적으로 반환
  } catch (error) {
    return done(error); // 에러 발생 시 에러를 반환
  }
});

module.exports = passport;

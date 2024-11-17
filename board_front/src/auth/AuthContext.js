import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
/*
 * 로그인상태를 전역에서 상태로 사용하기위한 컴포넌트임
 * context를사용해 관리
 * 
 * 사용할곳에서는
 * import { useAuth } from '../AuthContext';
 * const { isLoggedIn, email, userName, authCode, clientIp } = useAuth();
 * 이렇게 현재 로그인되어있는 발급받은JWT토큰의 정보들을 가져와서 사용가능
 */
// Context 생성
const AuthContext = createContext();

// Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState(''); // 사용자 이름
  const [authCode, setAuthCode] = useState(''); // 권한코드
  const [clientIp, setClientIp] = useState(''); // 접속ip주소
  // 페이지 로드 시 JWT 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        try {
            const decodedJWT = jwtDecode(token);
            setIsLoggedIn(true);
            setEmail(decodedJWT.email || '이메일오류');
            setUserName(decodedJWT.userName || '알수없는 사용자');
            setAuthCode(decodedJWT.authCode || '권한불명');
        } catch (error) {
            console.error('토큰을 불러오는데 실패:', error);
            setIsLoggedIn(false);
        }
    } else {
      setIsLoggedIn(false);
    }
    
    const fetchIp = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/ip`);
          const data = await response.json();
          setClientIp(data.ip);
        } catch (error) {
          console.error('IP를 불러오는데 실패:', error);
        }
      };
  
      fetchIp();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, email, userName, authCode, clientIp, setIsLoggedIn, setEmail, setUserName, setAuthCode}}>
      {children}
    </AuthContext.Provider>
  );
};

// Context 값에 접근할 수 있는 커스텀 훅
export const useAuth = () => useContext(AuthContext);

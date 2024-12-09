import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { disconnectSocket, initializeSocket } from "./socket";

const LogoutButton = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // 쿠키를 포함하여 요청
      });

      if (response.ok) {
        const socket = initializeSocket();
        socket.emit("user-logout");
        disconnectSocket();
        setUser(null);
        console.log('로그아웃 성공');
        navigate('/'); // 로그아웃 후 메인 페이지로 이동
      } else {
        console.error('로그아웃 실패:', await response.text());
      }
    } catch (error) {
      console.error('네트워크 오류:', error);
    }
  };

  return <button onClick={handleLogout}>로그아웃</button>;
};

export default LogoutButton;
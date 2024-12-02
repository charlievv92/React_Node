import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const OnlyLoginRoute = ({ children }) => {
  const { user } = useAuth();
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!user) {
    // 비로그인 상태라면 로그인 페이지로 리다이렉트
    // 리다이렉트할 때 현재 경로를 state로 함께 전달(로그인 페이지 무한 반복 이슈 해결)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 로그인 상태라면 자식 컴포넌트를 렌더링
  return children;
};

export default OnlyLoginRoute;

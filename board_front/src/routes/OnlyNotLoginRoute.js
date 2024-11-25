import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const OnlyNotLoginRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    // 로그인 상태라면 메인 페이지로 리다이렉트
    return <Navigate to="/" />;
  }

  // 비로그인 상태라면 자식 컴포넌트를 렌더링
  return children;
};

export default OnlyNotLoginRoute;
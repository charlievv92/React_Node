import "./App.css";
import { AuthProvider } from "./auth/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Board from "./pages/Board";
import MainGrid from "./dashboard/components/MainGrid";
import Mypage from "./pages/Mypage";
import BoardWrite from "./pages/BoardWrite";
import BoardList from "./pages/BoardList";
import BoardDetails from "./pages/BoardDetails";
import SignIn from "./auth/sign-in/SignIn";
import Signup from "./auth/sign-up/Signup";
import AdminLayout from "./admin/AdminLayout";
import OnlyNotLoginRoute from "./routes/OnlyNotLoginRoute";
import OnlyLoginRoute from "./routes/OnlyLoginRoute";
import AdminUserList from "./admin/components/AdminUserList";
import AdminBoardList from "./admin/components/AdminBoardList";

function App() {
  // TODO: 게시물 리스트 url에 params로 페이지 번호, 검색어 받아오는 기능 추가(20241121 kwc)
  return (
    <div>
        <BrowserRouter>
         <AuthProvider>
          <Routes>
            <Route path="/" element={<Board />}>
              <Route path="/" element={<MainGrid />}></Route>
              <Route
                path="/mypage"
                element={
                  <OnlyLoginRoute>
                    <Mypage />
                  </OnlyLoginRoute>
                }
              />
              <Route path="/articles" element={<BoardList />}></Route>
              <Route
                path="/articles/write"
                element={
                  <OnlyLoginRoute>
                    <BoardWrite />
                  </OnlyLoginRoute>
                }
              />
              <Route
                path="/articles/:board_id"
                element={<BoardDetails />}
              ></Route>
              <Route
                path="/articles/modify/:board_id"
                element={
                  <OnlyLoginRoute>
                    <BoardWrite />
                  </OnlyLoginRoute>
                }
              ></Route>
            </Route>

            <Route
              path="/login"
              element={
                <OnlyNotLoginRoute>
                  <SignIn />
                </OnlyNotLoginRoute>
              }
            />
            <Route path="/signup" element={<Signup />} />

            <Route path="/admin" element={<AdminLayout/>}>
              <Route path="/admin/users" element={<AdminUserList />}></Route>
              <Route path="/admin/articles" element={<AdminBoardList />}></Route>
            </Route>
          </Routes>
         </AuthProvider>
        </BrowserRouter>
    </div>
  );
}

export default App;

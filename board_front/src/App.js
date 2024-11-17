import "./App.css";
import { AuthProvider } from './auth/AuthContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Board from "./pages/Board";
import MainGrid from "./dashboard/components/MainGrid";
import Mypage from "./pages/Mypage";
import BoardWrite from "./pages/BoardWrite";
import BoardList from "./pages/BoardList";
import SignIn from "./auth/sign-in/SignIn";
import Signup from "./auth/sign-up/Signup";

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Board />}>
              <Route path="/" element={<MainGrid />}></Route>
              <Route path="/mypage" element={<Mypage />}></Route>
              <Route path="/board" element={<BoardWrite />}></Route>
              <Route path="/boardList" element={<BoardList />}></Route>
            </Route>
            <Route path="/loginpage" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;

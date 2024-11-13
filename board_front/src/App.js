import "./App.css";
// import Dashboard from "./dashboard/Dashboard";
import Board from "./pages/Board";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainGrid from "./dashboard/components/MainGrid";
import Mypage from "./pages/Mypage";
import BoardWrite from "./pages/BoardWrite";
import SignIn from "./login/sign-in/SignIn";
import Signup from "./login/sign-up/Signup";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Board />}>
            <Route path="/" element={<MainGrid />}></Route>
            <Route path="/mypage" element={<Mypage />}></Route>
            <Route path="/board" element={<BoardWrite />}></Route>
          </Route>
          <Route path="/loginpage" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

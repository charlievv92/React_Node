import "./App.css";
import Loginpage from "./pages/Loginpage";
// import Dashboard from "./dashboard/Dashboard";
import Board from "./pages/Board";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainGrid from "./dashboard/components/MainGrid";
import Mypage from "./pages/Mypage";
import BoardWrite from "./pages/BoardWrite";
import BoardList from "./pages/BoardList";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Board />}>
            <Route path="/" element={<MainGrid />}></Route>
            <Route path="/mypage" element={<Mypage />}></Route>
            <Route path="/board" element={<BoardWrite />}></Route>
            <Route path="/boardList" element={<BoardList />}></Route>
          </Route>
          <Route path="/loginpage" element={<Loginpage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import "./App.css";
import Loginpage from "./pages/Loginpage";
// import Dashboard from "./dashboard/Dashboard";
import Board from "./pages/Board";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainGrid from "./dashboard/components/MainGrid";
import Mypage from "./pages/Mypage";
import BoardWrite from "./pages/BoardWrite";
import BoardList from "./pages/BoardList";
import BoardDetails from "./pages/BoardDetails";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Board />}>
            <Route path="/" element={<MainGrid />}></Route>
            <Route path="/mypage" element={<Mypage />}></Route>
            <Route path="/articles" element={<BoardList />}></Route>
            <Route path="/articles/write" element={<BoardWrite />}></Route>
            <Route
              path="/articles/:board_id"
              element={<BoardDetails />}
            ></Route>
          </Route>
          <Route path="/loginpage" element={<Loginpage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

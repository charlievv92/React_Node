import "./App.css";
import Loginpage from "./components/Loginpage";
// import Dashboard from "./dashboard/Dashboard";
import Board from "./dashboard/Board";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainGrid from "./dashboard/components/MainGrid";
import Mypage from "./components/Mypage";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Board />} >
            <Route path="/" element={<MainGrid/>}></Route>
            <Route path="/mypage" element={<Mypage/>}></Route>
          </Route>
          <Route path="/loginpage" element={<Loginpage/>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;

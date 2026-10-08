import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireLogin from "./components/RequireLogin";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import AddRecord from "./pages/AddRecord";
import Profile from "./pages/Profile";
import "./styles_true.css";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Эти страницы доступны только после входа */}
          <Route element={<RequireLogin />}>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddRecord />} />
            <Route path="/edit/:id" element={<AddRecord />} />
            <Route path="/diary" element={<Diary />} />
          </Route>

          {/* Профиль (регистрация и вход) доступен всем */}
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

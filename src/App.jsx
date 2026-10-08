import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireLogin from "./components/RequireLogin";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import AddRecord from "./pages/AddRecord";
import Medications from "./pages/Medications";
import Appointments from "./pages/Appointments";
import Profile from "./pages/Profile";
import About from "./pages/About";
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
            <Route path="/medications" element={<Medications />} />
            <Route path="/appointments" element={<Appointments />} />
          </Route>

          {/* Эти страницы доступны всем */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./Contexts/DarkModeContext";
import LoginPage from "./Pages/LoginPage";
import MainPage from "./Pages/MainPage";
import BeaconPage from "./Pages/BeaconPage";
import LecturePage from "./Pages/LecturePage";
import AttendancePage from "./Pages/AttendancePage";
import "./App.module.scss";

const App = () => {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login/:sign" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/beacon" element={<BeaconPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/lecture" element={<LecturePage />} />
        </Routes>
      </DarkModeProvider>
    </BrowserRouter>
  );
};

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './Contexts/DarkModeContext';
import LoginPage from './Pages/LoginPage';
import MainPage from './Pages/MainPage';
import BeaconPage from './Pages/BeaconPage';
import LecturePage from './Pages/LecturePage/LecturePage';
import AttendancePage from './Pages/AttendancePage';
import './App.module.scss';

const App = () => {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login/:sign" element={<LoginPage />} />
          <Route path="/main/:userNumber" element={<MainPage />} />
          <Route path="/beacon/:userNumber" element={<BeaconPage />} />
          <Route path="/attendance/:userNumber" element={<AttendancePage />} />
          <Route path="/lecture/:userNumber" element={<LecturePage />} />
        </Routes>
      </DarkModeProvider>
    </BrowserRouter>
  );
};

export default App;

import "./App.module.scss";
import { DarkModeProvider } from "./Contexts/DarkModeContext";
import LoginPage from "./Pages/LoginPage";
import MainPage from "./Pages/MainPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </DarkModeProvider>
    </BrowserRouter>
  );
};

export default App;

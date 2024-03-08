import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SuperAdminPage from "./pages/SuperAdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="super-admin" element={<SuperAdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CurrencyConverter from "./pages/CurrencyConverter";
import Login from "./pages/Login";
import Main from "./pages/main";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/convert" element={<CurrencyConverter />} />
      </Routes>
    </Router>
  );
}

export default App;

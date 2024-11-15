import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CurrencyConverter from "./pages/CurrencyConverter";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/convert" element={<CurrencyConverter />} />
      </Routes>
    </Router>
  );
}

export default App;

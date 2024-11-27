import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CurrencyConverter from "./pages/CurrencyConverter";
import Login from "./pages/Login";
import Main from "./pages/Main";
import CreateBankAccount from "./pages/CreateBankAccount";
import Transfer from "./pages/Transfer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/account" element={<CreateBankAccount />} />
        <Route path="/convert" element={<CurrencyConverter />} />
        <Route path="/transfer" element={<Transfer />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useEffect, useState } from "react";
import Account from "../components/Account";
import Header from "../components/Header";

export default function Main() {
  const [accountInfo, setAccountInfo] = useState([]);

  const getBankAccountInfo = async () => {
    try {
      const response = await fetch("http://localhost:8000/account/info");
      if (!response.ok) {
        throw new Error("Failed to fetch bank accounts info");
      }
      const data = await response.json();
      setAccountInfo(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    getBankAccountInfo();
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center overflow-hidden pt-3">
      <Header name="Accounts" />
      <div className=" d-flex flex-column justify-content-center align-items-center w-50 mt-5">
        <div className="d-flex flex-column align-items-center w-75 overflow-auto"></div>
        <Account />
      </div>
    </div>
  );
}

import { useState } from "react";
import Account from "../components/Account";
import Header from "../components/Header";

export default function Main() {
  /* const [accountInfo, setAccountInfo] = useState([]);

  const getBankAccountInfo = async () => {
    try{
      const response = await fetch("")
    }
  }; */

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

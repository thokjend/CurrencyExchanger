import { useEffect, useState } from "react";
import Account from "../components/Account";
import Header from "../components/Header";

interface AccountInfo {
  accountName: string;
  accountNumber: string;
  currencyType: string;
  amount: number;
}

export default function Main() {
  const [accountInfo, setAccountInfo] = useState<AccountInfo[]>([]);

  const getBankAccountInfo = async () => {
    const username = localStorage.getItem("username");
    try {
      const response = await fetch(
        `http://localhost:8000/account/info/${username}/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch bank accounts info");
      }
      const data = await response.json();
      setAccountInfo(data.bankAccounts);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    getBankAccountInfo();
    console.log(accountInfo);
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center overflow-hidden pt-3">
      <Header name="Accounts" />
      <div className=" d-flex flex-column justify-content-center align-items-center w-50 mt-5">
        {accountInfo.length > 0 ? (
          accountInfo.map((account, index) => (
            <Account
              key={index}
              accountName={account.accountName}
              accountNumber={account.accountNumber}
              currencyType={account.currencyType}
              amount={account.amount}
            />
          ))
        ) : (
          <p className="text-light fs-2">
            No accounts available. Go to create account{" "}
          </p>
        )}
      </div>
    </div>
  );
}

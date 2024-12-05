import { useEffect, useState } from "react";
import Account from "../components/Account";
import Header from "../components/Header";
import { getUserBankAccounts } from "../services/AccountInfoService";

interface AccountInfo {
  accountName: string;
  accountNumber: string;
  currencyType: string;
  amount: number;
}

export default function Main() {
  const [accountInfo, setAccountInfo] = useState<AccountInfo[]>([]);

  const fetchUserBankAccounts = async () => {
    const username = localStorage.getItem("username");
    try {
      const data = await getUserBankAccounts(username);
      setAccountInfo(data);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  useEffect(() => {
    fetchUserBankAccounts();
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
              amount={Number(account.amount.toFixed(2))}
            />
          ))
        ) : (
          <p className="text-light fs-2">
            Loading accounts or no accounts available
          </p>
        )}
      </div>
    </div>
  );
}

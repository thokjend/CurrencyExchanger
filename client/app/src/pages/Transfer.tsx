import Header from "../components/Header";
import { useEffect, useState } from "react";
import {
  getUserBankAccounts,
  getBankAccount,
} from "../services/AccountInfoService";
import { Option, AccountInfo } from "../Utils/types";
import TransferForm from "../components/TransferForm";
import TransferButton from "../components/TransferButton";
import { transferAmount } from "../services/TransferService";

export default function Transfer() {
  const [accountInfo, setAccountInfo] = useState<AccountInfo[]>([]);
  const [transferFrom, setTransferFrom] = useState<Option | null>(null);
  const [transferTo, setTransferTo] = useState<Option | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [useExternalAccount, setUseExternalAccount] = useState(false);
  const [externalAccount, setExternalAccount] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchBankAccount = async (
    accountNumber: string
  ): Promise<AccountInfo | null> => {
    if (accountNumber.length !== 10) {
      setMessage("Account number must be 10 digits");
      setIsSuccess(false);
      return null;
    }

    try {
      const data: AccountInfo = await getBankAccount(accountNumber);
      return data;
    } catch (error) {
      console.error("Error fetching bank account data:", error);
      setMessage("Failed to fetch account detalis");
      setIsSuccess(false);
      return null;
    }
  };

  const fetchUserBankAccounts = async () => {
    const username = localStorage.getItem("username");
    try {
      const data: AccountInfo[] = await getUserBankAccounts(username);
      setAccountInfo(data);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  const handleTransfer = async () => {
    if (useExternalAccount) {
      try {
        const accountData = await fetchBankAccount(externalAccount);
        if (accountData) {
          const externalAccountOption: Option = {
            label: `${accountData.accountNumber} - ${
              accountData.accountName
            } (${accountData.amount.toFixed(2)} ${accountData.currencyType})`,
            value: accountData.accountNumber,
          };
          await transferAmount(
            transferFrom,
            externalAccountOption,
            amount,
            fetchUserBankAccounts,
            setMessage,
            setIsSuccess
          );
        }
      } catch (error) {
        console.error("Error transferring funds to external account:", error);
      }
    } else {
      await transferAmount(
        transferFrom,
        transferTo,
        amount,
        fetchUserBankAccounts,
        setMessage,
        setIsSuccess
      );
    }
  };

  const accountOptions = accountInfo.map((account) => ({
    label: `${account.accountNumber} - ${
      account.accountName
    } (${account.amount.toFixed(2)} ${account.currencyType})`,
    value: account.accountNumber,
  }));

  useEffect(() => {
    fetchUserBankAccounts();
  }, []);

  useEffect(() => {
    if (transferFrom) {
      const updatedTransferFrom = accountOptions.find(
        (option) => option.value === transferFrom.value
      );
      setTransferFrom(updatedTransferFrom || null);
    }

    if (transferTo) {
      const updatedTransferTo = accountOptions.find(
        (option) => option.value === transferTo.value
      );
      setTransferTo(updatedTransferTo || null);
    }
  }, [accountInfo]);

  return (
    <div className="d-flex flex-column align-items-center pt-3">
      <Header name="Transfer" />
      <div className="border text-light p-4 rounded shadow-sm center fw-bold">
        <h5 className="text-center mb-4 fs-4">Transfer Details</h5>
        <TransferForm
          accountOptions={accountOptions}
          transferFrom={transferFrom}
          transferTo={transferTo}
          useExternalAccount={useExternalAccount}
          externalAccount={externalAccount}
          amount={amount}
          setTransferFrom={setTransferFrom}
          setTransferTo={setTransferTo}
          setUseExternalAccount={setUseExternalAccount}
          setExternalAccount={setExternalAccount}
          setAmount={setAmount}
        />
        <TransferButton
          externalAccount={externalAccount}
          transferTo={transferTo}
          transferFrom={transferFrom}
          onclick={handleTransfer}
        />
      </div>
      {message && (
        <div
          className={`alert mt-3 w-25 fs-5 fw-bold text-center ${
            isSuccess ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

import Header from "../components/Header";
import Select, { SingleValue } from "react-select";
import {
  getUserBankAccounts,
  getBankAccount,
} from "../services/AccountInfoService";
import { useEffect, useState } from "react";
import TransferButton from "../components/TransferButton";

interface AccountInfo {
  accountName: string;
  accountNumber: string;
  currencyType: string;
  amount: number;
}

interface Option {
  label: string;
  value: string;
}

export default function Transfer() {
  const [accountInfo, setAccountInfo] = useState<AccountInfo[]>([]);
  const [transferFrom, setTransferFrom] = useState<Option | null>(null);
  const [transferTo, setTransferTo] = useState<Option | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [useExternalAccount, setUseExternalAccount] = useState(false);
  const [externalAccount, setExternalAccount] = useState("");

  const getConversionRate = async (
    fromCurrencyType: string,
    toCurrencyType: string
  ): Promise<number | null> => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/currencies/${fromCurrencyType}/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch conversion rate data");
      }
      const data = await response.json();
      return data[fromCurrencyType][toCurrencyType]; // Return the conversion rate to the target currency
    } catch (error) {
      console.error("Fetch error:", error);
      return null; // Return null on failure
    }
  };

  const getTransferData = (transferData: Option | null) => {
    const data = transferData?.label.match(/\((.*?)\)/)?.[1].split(" ");
    const availableAmount = data ? Number(data[0]) : 0;
    const currencyType = data ? data[1].toLowerCase() : "";
    return { availableAmount, currencyType };
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

  const fetchBankAccount = async (
    accountNumber: string
  ): Promise<AccountInfo | null> => {
    if (accountNumber.length !== 10) {
      alert("Account number must be 10 digits.");
      return null;
    }

    try {
      const data: AccountInfo = await getBankAccount(accountNumber);
      return data;
    } catch (error) {
      console.error("Error fetching bank account data:", error);
      alert("Failed to fetch external account details.");
      return null;
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
          await transferAmount(transferFrom, externalAccountOption);
        }
      } catch (error) {
        console.error("Error transferring funds to external account:", error);
      }
    } else {
      await transferAmount(transferFrom, transferTo);
    }
  };

  const transferAmount = async (
    transferFrom: Option | null,
    transferTo: Option | null
  ) => {
    const transferFromData = getTransferData(transferFrom);
    const transferToData = getTransferData(transferTo);

    if (!transferFrom?.value || !transferTo?.value) {
      alert("Incorrect account information.");
      return;
    } else if (transferFrom?.value === transferTo?.value) {
      alert("You cannot transfer to the same account.");
      return;
    } else if (amount > transferFromData.availableAmount) {
      alert("Insufficient funds");
      return;
    } else if (amount <= 0) {
      alert("Amount must be greater than zero.");
      return;
    }

    let convertedAmountToTransfer = amount;

    try {
      // Check if currencies are different and convert if necessary
      if (transferFromData.currencyType !== transferToData.currencyType) {
        const conversionRate = await getConversionRate(
          transferFromData.currencyType,
          transferToData.currencyType
        );

        if (!conversionRate) {
          alert("Failed to fetch conversion rate. Transfer aborted.");
          return;
        }

        convertedAmountToTransfer = amount * conversionRate;
      }

      // Send transfer request to the backend
      const response = await fetch(`http://localhost:8000/transfer/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TransferFromAccount: transferFrom?.value,
          TransferToAccount: transferTo?.value,
          Amount: amount,
          ConvertedAmount: convertedAmountToTransfer,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Transfer successful!");
        await fetchUserBankAccounts();
      } else {
        alert(data.error || "Transfer failed. Please try again.");
      }
    } catch (error) {
      console.error("Error transferring funds:", error);
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
        <div className="mb-3">
          <label htmlFor="transferFrom" className="form-label">
            Transfer From
          </label>
          <div className="text-dark">
            <Select
              id="transferFrom"
              placeholder="Select an account"
              options={accountOptions}
              value={transferFrom}
              onChange={(selectedOption: SingleValue<Option>) =>
                setTransferFrom(selectedOption)
              }
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="transferTo" className="form-label">
            <span>Transfer To</span>
            <div>
              <input
                type="checkbox"
                id="externalAccountCheckbox"
                className="form-check-input"
                checked={useExternalAccount}
                onChange={() => {
                  setUseExternalAccount((prev) => !prev);
                  setTransferTo(null);
                  setExternalAccount("");
                }}
              />
              <label
                htmlFor="externalAccountCheckbox"
                className="form-check-label ms-2"
              >
                External Account
              </label>
            </div>
          </label>
          <div className="text-dark">
            {useExternalAccount ? (
              <input
                style={{ height: "40px" }}
                type="number"
                className="w-100 fw-bold rounded ps-2"
                placeholder="Enter account number"
                value={externalAccount}
                onChange={(e) => setExternalAccount(e.target.value)}
              />
            ) : (
              <Select
                id="transferTo"
                placeholder="Select an account"
                value={transferTo}
                options={accountOptions}
                onChange={(selectedOption: SingleValue<Option>) =>
                  setTransferTo(selectedOption)
                }
              />
            )}
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <div>
            <input
              style={{ height: "40px" }}
              type="number"
              min={0}
              className="w-100 fw-bold rounded ps-2"
              placeholder="Enter amount to transfer"
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>
        <TransferButton
          externalAccount={externalAccount}
          transferTo={transferTo}
          transferFrom={transferFrom}
          onclick={handleTransfer}
        />
      </div>
    </div>
  );
}

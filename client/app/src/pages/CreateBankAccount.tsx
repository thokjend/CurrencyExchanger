import { useEffect, useState } from "react";
import Header from "../components/Header";
import Select from "react-select";

interface CurrencyOption {
  value: string;
  label: string;
}

export default function CreateBankAccount() {
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState<number>();
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [currencyType, setCurrencyType] = useState<CurrencyOption | null>(null);

  const getCurrencies = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/currencies/`);
      if (!response.ok) {
        throw new Error("Failed to fetch currency data");
      }
      const data = await response.json();

      const currencyOptions = Object.keys(data).map((key) => ({
        value: key,
        label: data[key],
      }));

      setCurrencies(currencyOptions);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const createAccount = async () => {
    try {
      const response = await fetch("http://localhost:8000/create/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          AccountName: accountName,
          CurrencyType: currencyType?.value,
          InitialAmount: amount,
        }),
      });
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    getCurrencies();
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center overflow-hidden pt-3">
      <Header name="Create Account" />
      <div className="border p-4 rounded center ">
        <form>
          <div className="mb-3 fw-bold">
            <label className="form-label text-light ">Account name:</label>
            <input
              type="text"
              className="form-control fw-bold"
              placeholder="Enter account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
          <div className="mb-3 fw-bold">
            <label className="form-label text-light">Currency type:</label>
            <Select
              options={currencies}
              value={currencyType}
              onChange={(selectedOption) => setCurrencyType(selectedOption)}
            />
          </div>
          <div className="mb-3 fw-bold">
            <label className="form-label text-light">Initial Amount:</label>
            <input
              type="number"
              min={0}
              className="form-control fw-bold"
              placeholder="Enter initial amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <button
            type="submit"
            className="btn btn-light fw-bold fs-5 w-100"
            disabled={accountName === "" || currencyType?.value === ""}
          >
            Create Account
          </button>
        </form>
      </div>
      {/* <button onClick={() => console.log(currencyType?.value)}>test</button> */}
    </div>
  );
}

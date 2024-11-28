import Header from "../components/Header";
import Select, { SingleValue } from "react-select";
import { getBankAccountInfo } from "../services/AccountInfoService";
import { useEffect, useState } from "react";

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
  const [accountOptions, setAccountOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [transferFrom, setTransferFrom] = useState<Option | null>(null);
  const [transferTo, setTransferTo] = useState<Option | null>(null);
  const [amount, setAmount] = useState<Number>(0);

  const fetchBankData = async () => {
    const username = localStorage.getItem("username");
    try {
      const data: AccountInfo[] = await getBankAccountInfo(username);
      setAccountInfo(data);

      const options = data.map((account) => ({
        label: `${account.accountNumber} - ${account.accountName} (${account.amount} ${account.currencyType})`,
        value: account.accountNumber,
      }));
      setAccountOptions(options);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  const transferAmount = async () => {
    try {
      const response = await fetch("http://localhost:8000/transfer/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TransferFrom: transferFrom?.value,
          TransferTo: transferTo?.value,
          Amount: amount,
        }),
      });
    } catch (error) {
      console.error("Error transfering funds:", error);
    }
  };

  useEffect(() => {
    fetchBankData();
    console.log(accountInfo);
  }, []);

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
              onChange={(selectedOption: SingleValue<Option>) =>
                setTransferFrom(selectedOption)
              }
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="transferTo" className="form-label">
            Transfer To
          </label>
          <div className="text-dark">
            <Select
              id="transferTo"
              placeholder="Select an account"
              options={accountOptions}
              onChange={(selectedOption: SingleValue<Option>) =>
                setTransferTo(selectedOption)
              }
            />
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
              className="w-100 fw-bold rounded ps-2"
              placeholder="Select amount to transfer"
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            className="btn btn-primary w-100 fw-bold fs-5"
            onClick={() => console.log(amount)}
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

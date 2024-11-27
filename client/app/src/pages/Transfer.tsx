import Header from "../components/Header";
import Select from "react-select";
import { getBankAccountInfo } from "../services/AccountInfoService";
import { useEffect, useState } from "react";

interface AccountInfo {
  accountName: string;
  accountNumber: string;
  currencyType: string;
  amount: number;
}

export default function Transfer() {
  const [accountInfo, setAccountInfo] = useState<AccountInfo[]>([]);

  const fetchBankData = async () => {
    const username = localStorage.getItem("username");
    try {
      const data = await getBankAccountInfo(username);
      setAccountInfo(data);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  useEffect(() => {
    fetchBankData();
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
          <Select id="transferFrom" placeholder="Select an account" />
        </div>
        <div className="mb-3">
          <label htmlFor="transferTo" className="form-label">
            Transfer To
          </label>
          <Select id="transferTo" placeholder="Select an account" />
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-primary w-100 fw-bold fs-5">
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

import AccountSelector from "./AccountSelector";
import { Option } from "../Utils/types";

interface TransferFormProps {
  accountOptions: Option[];
  transferFrom: Option | null;
  transferTo: Option | null;
  useExternalAccount: boolean;
  externalAccount: string;
  amount: number;
  setTransferFrom: React.Dispatch<React.SetStateAction<Option | null>>;
  setTransferTo: React.Dispatch<React.SetStateAction<Option | null>>;
  setUseExternalAccount: React.Dispatch<React.SetStateAction<boolean>>;
  setExternalAccount: React.Dispatch<React.SetStateAction<string>>;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}

export default function TransferForm({
  accountOptions,
  transferFrom,
  transferTo,
  useExternalAccount,
  externalAccount,
  amount,
  setTransferFrom,
  setTransferTo,
  setUseExternalAccount,
  setExternalAccount,
  setAmount,
}: TransferFormProps) {
  return (
    <>
      <AccountSelector
        id="transferFrom"
        label="Transfer From"
        options={accountOptions}
        value={transferFrom}
        onChange={setTransferFrom}
      />
      <div className="mb-3">
        <label htmlFor="transferTo" className="form-label">
          Transfer To
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
            <AccountSelector
              id="transferTo"
              label="Transfer To"
              options={accountOptions}
              value={transferTo}
              onChange={setTransferTo}
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
            value={amount > 0 ? amount : ""}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
      </div>
    </>
  );
}

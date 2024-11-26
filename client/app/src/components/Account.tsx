import AccountField from "./AccountField";

interface AccountProps {
  accountNumber: string;
  accountName: string;
  currencyType: string;
  amount: number;
}

export default function Account({
  accountNumber,
  accountName,
  currencyType,
  amount,
}: AccountProps) {
  return (
    <div className="text-light border w-75 m-3" style={{ height: "200px" }}>
      <div className="d-flex justify-content-center" style={{ height: "50%" }}>
        <AccountField text="Account number" value={accountNumber} />
        <AccountField text="Account name" value={accountName} />
      </div>
      <div className="d-flex justify-content-center" style={{ height: "50%" }}>
        <AccountField text="Currency type" value={currencyType} />
        <AccountField text="Amount" value={amount} />
      </div>
    </div>
  );
}

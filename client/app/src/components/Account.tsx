import AccountField from "./AccountField";

export default function Account() {
  return (
    <div className="text-light border w-75 m-3" style={{ height: "200px" }}>
      <div className="d-flex justify-content-center" style={{ height: "50%" }}>
        <AccountField text="Account number" value="12391023" />
        <AccountField text="Account name" value="Sparekonto" />
      </div>
      <div className="d-flex justify-content-center" style={{ height: "50%" }}>
        <AccountField text="Currency type" value="Norwegian Krone" />
        <AccountField text="Amount" value="50000" />
      </div>
    </div>
  );
}

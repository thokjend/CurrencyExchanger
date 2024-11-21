import Account from "../components/Account";

export default function Main() {
  return (
    <div className="bg-dark vh-100 d-flex justify-content-center align-items-center overflow-auto">
      <div className=" d-flex flex-column justify-content-center align-items-center w-50">
        <div className="text-white fs-3">Accounts</div>
        <Account />
      </div>
    </div>
  );
}

import Account from "../components/Account";
import Header from "../components/Header";

export default function Main() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center overflow-hidden pt-5">
      <Header name="Accounts" />
      <div className=" d-flex flex-column justify-content-center align-items-center w-50">
        <div className="d-flex flex-column align-items-center w-75 overflow-auto">
          <Account />
          <Account />
          <Account />
          <Account />
        </div>
      </div>
    </div>
  );
}

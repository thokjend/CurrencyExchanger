import Account from "../components/Account";
import NavButton from "../components/NavButton";

export default function Main() {
  return (
    <div className="bg-dark vh-100 d-flex flex-column justify-content-center align-items-center overflow-auto pt-5">
      <div className=" d-flex flex-column justify-content-center align-items-center w-50">
        <div className="text-white fs-3 border d-flex fs-1 fw-bolder w-75">
          <NavButton />
          <NavButton />
          Accounts
          <NavButton />
          <NavButton />
        </div>
        <Account />
      </div>
    </div>
  );
}

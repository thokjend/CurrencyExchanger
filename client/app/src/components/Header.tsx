import NavButton from "./NavButton";

interface HeaderProps {
  name: string;
}

export default function Header({ name }: HeaderProps) {
  return (
    <div className="text-white d-flex w-100 justify-content-around align-items-center">
      <NavButton name="Home" page="/main" />
      <NavButton name="Create Account" page="/account" />
      <div className="fs-1 fw-bolder">{name}</div>
      <NavButton name="Transfer" page="/transfer" />
      <NavButton name="Exchange Rates" page="/convert" />
    </div>
  );
}

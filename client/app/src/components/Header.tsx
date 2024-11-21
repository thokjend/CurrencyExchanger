import NavButton from "./NavButton";

export default function Header() {
  return (
    <div className="d-flex w-50 justify-content-around position-fixed top-0">
      <NavButton></NavButton>
      <NavButton></NavButton>
      <NavButton></NavButton>
      <NavButton></NavButton>
    </div>
  );
}

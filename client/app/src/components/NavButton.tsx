import { useNavigate } from "react-router-dom";
interface NavButtonProps {
  name: string;
  page: string;
}

export default function NavButton({ name, page }: NavButtonProps) {
  const navigate = useNavigate();
  return (
    <div
      className="d-flex justify-content-center align-items-center text-center nav-button"
      onClick={() => navigate(page)}
    >
      {name}
    </div>
  );
}

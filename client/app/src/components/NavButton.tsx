import { useNavigate } from "react-router-dom";
interface NavButtonProps {
  name: string;
  page: string;
}

export default function NavButton({ name, page }: NavButtonProps) {
  const navigate = useNavigate();
  return (
    <button
      className="border d-flex justify-content-center align-items-center text-center "
      onClick={() => navigate(page)}
      style={{
        width: "100px",
        height: "100px",
        borderRadius: "50px",
        lineHeight: "1.2",
      }}
    >
      {name}
    </button>
  );
}

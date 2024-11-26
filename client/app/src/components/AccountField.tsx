interface AccountFieldProps {
  text: string;
  value: string | number;
}

export default function AccountField({ text, value }: AccountFieldProps) {
  return (
    <div className=" w-50 d-flex flex-column justify-content-center align-items-center">
      <div className="text-decoration-underline fs-4 fw-bold">{text}</div>
      <div className="fs-5">{value}</div>
    </div>
  );
}

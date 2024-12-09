interface TransferButtonProps {
  externalAccount: string;
  transferTo: { label: string; value: string } | null;
  transferFrom: { label: string; value: string } | null;
  onclick: () => any;
}
export default function TransferButton({
  externalAccount,
  transferTo,
  transferFrom,
  onclick,
}: TransferButtonProps) {
  return (
    <div className="text-center mt-4">
      <button
        className="btn btn-primary w-100 fw-bold fs-5"
        onClick={onclick}
        disabled={!transferFrom || (!transferTo && externalAccount == "")}
      >
        Transfer
      </button>
    </div>
  );
}

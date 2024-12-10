import Select, { SingleValue } from "react-select";
import { Option } from "../Utils/types";

interface AccountSelectorProps {
  id: string;
  label: string;
  options: Option[];
  value: Option | null;
  onChange: (selectedOption: SingleValue<Option>) => void;
}

export default function AccountSelector({
  id,
  label,
  options,
  value,
  onChange,
}: AccountSelectorProps) {
  return (
    <div className="mb-3">
      <div className="text-dark">
        <Select
          id={id}
          placeholder={`Select ${label.toLowerCase()}`}
          options={options}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

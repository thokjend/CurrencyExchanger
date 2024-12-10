import { Option } from "./types";

export const getTransferData = (transferData: Option | null) => {
  const data = transferData?.label.match(/\((.*?)\)/)?.[1].split(" ");
  const availableAmount = data ? Number(data[0]) : 0;
  const currencyType = data ? data[1].toLowerCase() : "";
  return { availableAmount, currencyType };
};

import { getConversionRate } from "./CurrencyService";
import { getTransferData } from "../Utils/TransferUtils";
import { Option } from "../Utils/types";

export const transferAmount = async (
  transferFrom: Option | null,
  transferTo: Option | null,
  amount: number,
  fetchUserBankAccounts: () => Promise<void>,
  setMessage: (message: string) => void,
  setIsSuccess: (success: boolean) => void
) => {
  const transferFromData = getTransferData(transferFrom);
  const transferToData = getTransferData(transferTo);

  if (!transferFrom?.value || !transferTo?.value) {
    setMessage("Incorrect account information");
    setIsSuccess(false);
    return;
  } else if (transferFrom?.value === transferTo?.value) {
    setMessage("You cannot transfer to the same account");
    setIsSuccess(false);
    return;
  } else if (amount > transferFromData.availableAmount) {
    setMessage("Insufficient funds");
    setIsSuccess(false);
    return;
  } else if (amount <= 0) {
    setMessage("Amount must be greater than zero");
    setIsSuccess(false);
    return;
  }

  let convertedAmountToTransfer = amount;

  try {
    // Check if currencies are different and convert if necessary
    if (transferFromData.currencyType !== transferToData.currencyType) {
      const conversionRate = await getConversionRate(
        transferFromData.currencyType,
        transferToData.currencyType
      );

      if (!conversionRate) {
        setMessage("Failed to fetch conversion rate. Transfer aborted.");
        setIsSuccess(false);
        return;
      }

      convertedAmountToTransfer = amount * conversionRate;
    }

    // Send transfer request to the backend
    const response = await fetch(`http://localhost:8000/transfer/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        TransferFromAccount: transferFrom?.value,
        TransferToAccount: transferTo?.value,
        Amount: amount,
        ConvertedAmount: convertedAmountToTransfer,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Amount successfully transferred");
      setIsSuccess(true);
      await fetchUserBankAccounts();
    } else {
      alert(data.error || "Transfer failed. Please try again.");
    }
  } catch (error) {
    console.error("Error transferring funds:", error);
  }
};

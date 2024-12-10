export const getConversionRate = async (
  fromCurrencyType: string,
  toCurrencyType: string
): Promise<number | null> => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/currencies/${fromCurrencyType}/`
    );
    if (!response.ok) throw new Error("Failed to fetch conversion rate data");

    const data = await response.json();
    return data[fromCurrencyType][toCurrencyType];
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const getUserBankAccounts = async (username: string | null) => {
  if (!username) {
    throw new Error("Username is required to fetch account info.");
  }

  try {
    const response = await fetch(
      `http://localhost:8000/account/info/${username}/`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch bank accounts info");
    }
    const data = await response.json();
    return data.bankAccounts;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const getBankAccount = async (accountNumber: string | undefined) => {
  if (!accountNumber) {
    throw new Error("AccountNumber is required to fetch account info");
  }
  try {
    const response = await fetch(
      `http://localhost:8000/account/${accountNumber}/`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch bank account info");
    }
    const data = await response.json();
    return data.Account;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

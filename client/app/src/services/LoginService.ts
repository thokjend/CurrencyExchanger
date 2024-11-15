export const createAccount = async (username: string, password: string) => {
  try {
    const response = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: username,
        Password: password,
      }),
    });

    if (response.ok) {
      return { success: true };
    } else if (response.status === 400) {
      return { success: false };
    } else {
      throw new Error("Failed to user to the database");
    }
  } catch (error) {
    console.error("Database error:", error);
  }
};

export const login = async (username: string, password: string) => {
  try {
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: username,
        Password: password,
      }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Database error:", error);
  }
};

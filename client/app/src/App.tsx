import { useEffect, useState } from "react";
import Select from "react-select";

interface CurrencyOption {
  value: string;
  label: string;
}

function App() {
  const [ammount, setAmmount] = useState<number>(0);
  const [convertFrom, setConvertFrom] = useState<CurrencyOption | null>(null);
  const [convertTo, setConvertTo] = useState<CurrencyOption | null>(null);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);

  const getCurrencies = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/currencies/`);
      if (!response.ok) {
        throw new Error("Failed to fetch currency data");
      }
      const data = await response.json();

      const currencyOptions = Object.keys(data).map((key) => ({
        value: key,
        label: data[key],
      }));

      setCurrencies(currencyOptions);
      console.log(currencies);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const getConvertionRate = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/currencies/${convertFrom?.value}`
      );
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    getCurrencies();
  }, []);

  return (
    <>
      <div>
        <input
          type="number"
          placeholder="ammount"
          onChange={(e) => setAmmount(Number(e.target.value))}
        />
        <div style={{ maxWidth: "300px" }}>
          <Select
            options={currencies}
            value={convertFrom}
            onChange={(selectedOption) => setConvertFrom(selectedOption)}
          />
        </div>
        <div style={{ maxWidth: "300px" }}>
          <Select
            options={currencies}
            value={convertTo}
            onChange={(selectedOption) => setConvertTo(selectedOption)}
          />
        </div>

        <button onClick={() => console.log(convertTo?.value)}>Convert</button>
      </div>
    </>
  );
}

export default App;

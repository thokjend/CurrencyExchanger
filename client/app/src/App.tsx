import { useState } from "react";

function App() {
  const [ammount, setAmmount] = useState(Number);
  const [convertFrom, setConvertFrom] = useState("");
  const [convertTo, setConvertTo] = useState("");

  const convert = async () => {
    const response =
      await `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${convertFrom}.json`;
  };

  return (
    <>
      <div>
        <input
          type="number"
          placeholder="ammount"
          onChange={(e) => setAmmount(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="From"
          onChange={(e) => setConvertFrom(e.target.value)}
        />
        <input
          type="text"
          placeholder="To"
          onChange={(e) => setConvertTo(e.target.value)}
        />
        <button onClick={() => convert()}>Convert</button>
      </div>
    </>
  );
}

export default App;

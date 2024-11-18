import { useEffect, useState } from "react";
import Select from "react-select";
import { LineChart } from "@mui/x-charts";

interface CurrencyOption {
  value: string;
  label: string;
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(0);
  const [convertFrom, setConvertFrom] = useState<CurrencyOption | null>(null);
  const [convertTo, setConvertTo] = useState<CurrencyOption | null>(null);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [date, setDate] = useState("");
  const [conversionRates, setConversionRates] = useState<Record<
    string,
    number
  > | null>(null);

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
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const getConvertionRate = async () => {
    if (!convertFrom) return;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/currencies/${convertFrom?.value}/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch conversion rate data");
      }

      const data = await response.json();
      setConversionRates(data[convertFrom.value]);
      setDate(data.date);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const conversionRatesByDate = async () => {
    try {
    } catch {}
  };

  const swapCurrencies = () => {
    setConvertFrom(convertTo);
    setConvertTo(convertFrom);
  };

  useEffect(() => {
    getCurrencies();
  }, []);

  useEffect(() => {
    getConvertionRate();
  }, [convertTo, convertFrom]);

  const convertedAmount =
    convertTo && conversionRates
      ? amount * conversionRates[convertTo.value]
      : 0;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark">
      <div className="mb-5 text-light fs-1 fw-bolder">Currency Converter</div>
      {date && (
        <div className="text-light mb-4">
          Last updated: <span className="fw-bold">{date}</span>
        </div>
      )}
      <div className="text-center d-flex flex-column h-25 justify-content-center align-items-center border border-light p-5 rounded bg-dark">
        <div className="row text-light mb-2 w-100 fw-bold fs-4">
          <div className="col-2 text-start">Amount</div>
          <div className="col-6">From</div>
          <div className="col-4 text-center">To</div>
        </div>

        <div className="d-flex flex-row align-items-center border">
          <div className="m-2 d-flex">
            <input
              type="number"
              min={0}
              className="form-control"
              placeholder="Amount"
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="m-2" style={{ width: "300px" }}>
            <Select
              options={currencies}
              value={convertFrom}
              onChange={(selectedOption) => setConvertFrom(selectedOption)}
            />
          </div>
          <div>
            <button
              className="btn btn-primary"
              onClick={() => swapCurrencies()}
            >
              ⇆
            </button>
          </div>
          <div className="m-2" style={{ width: "300px" }}>
            <Select
              options={currencies}
              value={convertTo}
              onChange={(selectedOption) => setConvertTo(selectedOption)}
            />
          </div>
        </div>

        {convertedAmount > 0 && (
          <div className="mt-3 fs-1 fw-bold">
            <p className="text-light">
              {amount} {convertFrom?.label} = {convertedAmount.toFixed(2)}{" "}
              {convertTo?.label}{" "}
            </p>
          </div>
        )}
      </div>

      <div className="pt-5">
        <LineChart
          xAxis={[
            {
              data: [
                new Date("2024-11-01"),
                new Date("2024-11-02"),
                new Date("2024-11-03"),
                new Date("2024-11-04"),
                new Date("2024-11-05"),
                new Date("2024-11-06"),
                new Date("2024-11-07"),
                new Date("2024-11-08"),
                new Date("2024-11-09"),
                new Date("2024-11-10"),
              ],
              valueFormatter: (timestamp) =>
                new Date(timestamp).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                }),
            },
          ]}
          yAxis={[
            {
              label: "Value", // Label for the Y-axis
            },
          ]}
          series={[
            {
              data: [2, 8, 4, 10, 6, 7, 8, 9, 1, 10], // Y-axis data points
              color: "blue", // Set a custom color for the line
              showMark: false,
            },
          ]}
          width={1000} // Width of the chart
          height={400} // Height of the chart
          sx={{
            backgroundColor: "white", // Dark background for contrast
            borderRadius: "8px", // Rounded corners
          }}
        />
      </div>
    </div>
  );
}

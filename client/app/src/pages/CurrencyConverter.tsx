import { useEffect, useState } from "react";
import Select from "react-select";
import { LineChart } from "@mui/x-charts";
import Header from "../components/Header";

interface CurrencyOption {
  value: string;
  label: string;
}

interface RateByDate {
  date: string;
  rate: number;
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
  const [storeDates, setStoreDates] = useState<RateByDate[]>([]);
  const [isDoneLoading, setIsDoneLoading] = useState(false);
  const [conversionRatesFetched, setConversionRatesFetched] = useState(false);

  console.log(storeDates);
  //console.log(convertFrom?.value);
  //console.log(storeDates.map((item) => item.date).length);

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

  const getConversionRate = async () => {
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

  const storeConversionRates = async () => {
    if (!convertFrom || !convertTo || storeDates.length === 0) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/store/conversionRates/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            BaseCurrency: convertFrom.value,
            TargetCurrency: convertTo.value,
            Rates: storeDates, // Pass the array of {date, rate}
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to store conversion rates");
      }

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error in storing conversion rates:", error);
    }
  };

  const deleteOldRates = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/delete/conversionRates/${convertFrom?.value}/${convertTo?.value}/`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete old conversion rates");
      }
      const data = await response.json();
      console.log("Old conversion rates deleted:", data.message);
    } catch (error) {
      console.error("Error deleting conversion rates:", error);
    }
  };

  const searchForConversionRates = async () => {
    if (!convertFrom || !convertTo) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/conversionRates/${convertFrom?.value}/${convertTo?.value}/`
      );

      if (response.ok) {
        const data = await response.json();
        const rates = data["Conversion rates"].map(
          (rate: { date: string; rate: number }) => ({
            date: rate.date,
            rate: rate.rate,
          })
        );

        const lastStoredDate = rates[rates.length - 1]?.date;
        const todayDate = new Date().toISOString().split("T")[0];

        if (lastStoredDate !== todayDate) {
          console.log("Outdated data found. Deleting old data...");
          await deleteOldRates();
          console.log("Fetching new data...");
          await conversionRatesByDate();
        } else {
          console.log("Using stored conversion rates.");
          setStoreDates(rates);
        }
      } else {
        console.log("No stored data found. Fetching from API...");
        await conversionRatesByDate();
      }
    } catch (error) {
      console.error("Error fetching stored conversion rates:", error);
      await conversionRatesByDate();
    } finally {
      setIsDoneLoading(true);
    }
  };

  const conversionRatesByDate = async () => {
    if (!convertFrom || !convertTo) return;
    try {
      const today = new Date();
      const rates: { date: string; rate: number }[] = [];

      for (let i = 0; i <= 31; i++) {
        const previousDate = new Date(today);
        previousDate.setDate(today.getDate() - i);
        const formattedDate = previousDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
        const response = await fetch(
          `http://127.0.0.1:8000/api/currencies/${convertFrom?.value}/${formattedDate}/`
        );

        if (!response.ok) {
          console.error(`Failed to fetch data for ${formattedDate}`);
          continue;
        }
        const data = await response.json();
        const conversionRate = data[convertFrom.value]?.[convertTo.value];

        if (conversionRate !== undefined) {
          rates.push({ date: formattedDate, rate: conversionRate });
        }
      }

      setStoreDates(rates.reverse());
      setConversionRatesFetched(true);

      //await storeConversionRates();
    } catch (error) {
      console.error("Error in fetching conversion rates:", error);
    } finally {
      setIsDoneLoading(true);
    }
  };

  const swapCurrencies = () => {
    setConvertFrom(convertTo);
    setConvertTo(convertFrom);
  };

  useEffect(() => {
    if (conversionRatesFetched) {
      storeConversionRates();
      setConversionRatesFetched(false);
    }
  }, [conversionRatesFetched]);

  useEffect(() => {
    getCurrencies();
  }, []);

  useEffect(() => {
    getConversionRate();
    searchForConversionRates();
    //conversionRatesByDate();
  }, [convertTo, convertFrom]);

  const convertedAmount =
    convertTo && conversionRates
      ? amount * conversionRates[convertTo.value]
      : 0;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center pt-3">
      <Header name="Currency Converter" />
      {/* <div className="mb-5 text-light fs-1 fw-bolder">Currency Converter</div> */}
      {date && (
        <div className="text-light mb-1">
          Last updated: <span className="fw-bold">{date}</span>
        </div>
      )}
      <div className="text-center d-flex flex-column justify-content-center align-items-center border border-light p-5 rounded m-3">
        <div className="row text-light mb-2 w-100 fw-bold fs-4">
          <div className="col-2 text-start">Amount</div>
          <div className="col-6">From</div>
          <div className="col-4 text-center">To</div>
        </div>

        <div className="d-flex flex-row align-items-center border fw-bold">
          <div className="m-2 d-flex">
            <input
              type="number"
              min={0}
              className="form-control fw-bold"
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
      </div>
      {convertedAmount > 0 && (
        <div className="mt-3 fs-3 fw-bold">
          <p className="text-light">
            {amount} {convertFrom?.label} = {convertedAmount.toFixed(3)}{" "}
            {convertTo?.label}{" "}
          </p>
        </div>
      )}

      {convertTo !== null && convertFrom !== null && (
        <div className="">
          <div className="text-light fs-3 d-flex justify-content-center">
            {convertFrom?.value.toUpperCase()} To{" "}
            {convertTo?.value.toUpperCase()} Chart
          </div>
          <LineChart
            xAxis={[
              {
                data: storeDates.map((item) => new Date(item.date).getTime()),
                valueFormatter: (timestamp) =>
                  new Date(timestamp).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }),
                disableLine: true,
                disableTicks: true,
              },
            ]}
            grid={{
              horizontal: true,
              vertical: true,
            }}
            yAxis={[
              {
                disableLine: true,
                disableTicks: true,
              },
            ]}
            loading={!isDoneLoading ? true : false}
            series={[
              {
                data: storeDates.map((item) => item.rate),
                color: "blue",
                showMark: false,
              },
            ]}
            width={1025}
            height={400}
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
            }}
          />
        </div>
      )}
    </div>
  );
}

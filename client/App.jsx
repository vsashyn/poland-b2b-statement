import { useState } from "react";
import * as c from "./app.module.css";

export function App() {
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  return (
    <div>
      <h1 className={c.header}>Poland B2B statement generator</h1>
      <div>
        <p>
          Year:
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={c.year}
          >
            <option value="">Select Year</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </p>
        <p>
          Month:
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="month_select"
          >
            <option value="">Select Month</option>
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">August</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>
          </select>
        </p>
        <p>
          City:
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
          />
        </p>
        <p>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </p>
        <p>
          Postal code:
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            />
        </p>
      </div>
      <button
        onClick={(e) => {
          console.log(month, city, address, postalCode);
          const url = new URLSearchParams();
          url.append("year", year);
          url.append("month", month);
          url.append("city", city);
          url.append("address", address);
          url.append("postalCode", postalCode);
          window.open(`./doc?${url.toString()}`);
        }}
      >
        Generate document
      </button>
    </div>
  );
}

import { useState } from "react";
import * as c from "./app.module.css";

export function App() {
  const date = new Date();
  const [year, setYear] = useState(date.getFullYear().toString());
  const [month, setMonth] = useState(date.getMonth().toString());
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [activity, setActivity] = useState("Software development");
  return (
    <div className="main">
      <h1>Poland B2B statement generator</h1>
      <div>
        <label for="year">Year</label>
        <select
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
        <label for="month">Month</label>
        <select
          id="month"
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
        <label for="city">City</label>
        <input
          id="city"
          type="text"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
        />
        <label for="address">Address</label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <label for="postalCode">Postal code</label>
        <input
          id="postalCode"
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
      <label for="activity">Activity</label>
        <input
          id="activity"
          type="text"
          value={activity}
          onChange={(e) => {
            setActivity(e.target.value);
          }}
        />
      </div>
      <button
        onClick={(e) => {
          const url = new URLSearchParams();
          url.append("year", year);
          url.append("month", month);
          url.append("city", city);
          url.append("address", address);
          url.append("postalCode", postalCode);
          url.append("activity", activity);
          window.open(`./doc?${url.toString()}`);
        }}
        className={c.btn}
      >
        Generate PDF
      </button>
      <footer>
        Please send bugs and feature requests to &nbsp;
        <a href="mailto:sashyn.v@gmail.com">sashyn.v@gmail.com</a>
      </footer>
    </div>
  );
}

import { useState } from "react";

export function App() {
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  return (
    <div>
      <h1>Poland b2b statement generator</h1>
      <div>
        Year:
      <select value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="">Select Year</option>
        <option value='2023'>2023</option>
        <option value="2024">2024</option>
      </select>
        Month:
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
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
        City:
        <input
          type="text"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
        />
        Address:
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        Postal code:
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
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
        Generate
      </button>
    </div>
  );
}

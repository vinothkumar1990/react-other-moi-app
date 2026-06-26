import React, { useEffect, useState } from "react";
import data from "../assets/mois.json";
import { Atom } from "react-loading-indicators";
import "./Home.css";
import { Slides } from "./Slides";
import useData from "./custom-hook/useData"; // custom hook

export const Home = ({ cart, setCart }) => {
  // Logged in user
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); 
  const userFunction = loggedInUser?.function_name || "";

  // Fetch data from Supabase
  const { products, error, isLoading } = useData(
    "https://ievyooeawrzhkemxfswj.supabase.co/rest/v1/mois",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI",
        "Content-Type": "application/json",
      },
    }
  );

  const [loadingLocal, setLoadingLocal] = useState(true);

  // Fallback JSON loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingLocal(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Decide which data to use
  const activeData = products && products.length > 0 ? products : data;

  // ✅ FILTERING BASED ON function_name
  const filteredData = activeData.filter(
    (item) =>
      String(item.function_name).trim().toLowerCase() ===
      String(userFunction).trim().toLowerCase()
  );

  // Group by name
  const grouped = filteredData.reduce((acc, curr) => {
    if (!acc[curr.name]) acc[curr.name] = [];
    acc[curr.name].push(curr);
    return acc;
  }, {});

  const thStyle = {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  };

  const tdTotalStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
    color: "#39740c",
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || loadingLocal) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <center>
          <Atom color="#32cd32" size="medium" />
        </center>
      </div>
    );
  }

  if (error) {
    return (
      <p style={{ color: "red", textAlign: "center" }}>
        Error loading data.
      </p>
    );
  }

  return (
    <div>
      {/* Slides Section */}
      <div className="slides-section">
        <Slides />
      </div>

      {/* Print Button */}
      <div style={{ textAlign: "right", margin: "10px" }} className="no-print">
        <button
          onClick={handlePrint}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0275d8",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Print Page
        </button>
      </div>

      {/* Grouped Table */}
      <div style={{ maxWidth: "100%", width: "100%", padding: "10px" }}>
        {Object.entries(grouped).length === 0 ? (
          <p style={{ textAlign: "center", color: "red", fontSize: "18px" }}>
            No records found for your Function Name: <b>{userFunction}</b>
          </p>
        ) : (
          Object.entries(grouped).map(([name, items]) => (
            <div
              key={name}
              style={{
                marginBottom: "30px",
                border: "1px solid #aaa",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: "#0275d8",
                  color: "white",
                  padding: "10px 15px",
                  fontSize: "18px",
                }}
              >
                {name}
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  width="100%"
                  border="1"
                  style={{
                    borderCollapse: "collapse",
                    minWidth: "1200px",
                    fontSize: "14px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f1f1f1" }}>
                      <th style={thStyle}>ஊர்</th>
                      <th style={thStyle}>பழைய பணம்</th>
                      <th style={thStyle}>புதிய பணம்</th>
                      <th style={thStyle}>தடவை</th>
                      <th style={thStyle}>திருமண விழா</th>
                      <th style={thStyle}>நிலை</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item, index) => (
                      <tr
                        key={item.id || index}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#f7d4e7" : "#e2e2e2",
                        }}
                      >
                        <td style={tdStyle}>{item.place}</td>
                        <td style={tdStyle}>{item.old_amount}</td>
                        <td style={tdStyle}>{item.new_amount}</td>
                        <td style={tdStyle}>{item.given_amount_status}</td>
                        <td style={tdStyle}>{item.function_name}</td>
                        <td
                          style={{
                            ...tdStyle,
                            color:
                              item.status === "Pending" ? "green" : "red",
                          }}
                        >
                          {item.status === "Pending"
                            ? "நிலுவையில் உள்ளது"
                            : "நிறைவு"}
                        </td>
                      </tr>
                    ))}

                    <tr
                      style={{
                        backgroundColor: "#dff0d8",
                        fontWeight: "bold",
                      }}
                    >
                      <td></td>
                      <td></td>
                      <td style={tdTotalStyle}>
                        மொத்தம்:{" "}
                        {items.reduce(
                          (total, item) =>
                            total + parseFloat(item.new_amount || 0),
                          0
                        )}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PRINT STYLES */}
      <style>
        {`
        @media print {
          @page {
            size: landscape;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .slides-section, .no-print {
            display: none !important;
          }
        }
      `}
      </style>
    </div>
  );
};

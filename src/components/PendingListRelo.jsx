import React, { useEffect, useState } from "react";
import data from "../assets/pending.json";
import { BlinkBlur } from "react-loading-indicators";
import useData from "./custom-hook/useData";
import "./Home.css";

export const PendingListRelo = () => {
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

  const [mois, setMois] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load fallback data
  useEffect(() => {
    if (products && products.length > 0) {
      setMois(products);
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setMois(data);
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [products]);

  // ✅ Get logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userFunction = loggedInUser?.function_name;

  // ✅ FILTER BASED ON STATUS + FUNCTION_NAME
  const pendingMois = (products.length > 0 ? products : data)
    .filter((item) => item.status?.toLowerCase() === "pending")
    .filter((item) => item.function_name === userFunction);

  // Group by function_name
  const grouped = pendingMois.reduce((acc, curr) => {
    const key = curr.function_name || "Others";
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  const thStyle = {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
    fontWeight: "bold",
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
    fontWeight: "bold",
  };

  const handlePrint = () => window.print();

  // Loading State
  if (loading || isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <BlinkBlur color="#32cd32" size="medium" />
      </div>
    );
  }

  // No Pending Data
  if (pendingMois.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
        No pending records for your function.
      </div>
    );
  }

  return (
    <div>
      {/* Print Button */}
      <div style={{ textAlign: "right", margin: "10px" }}>
        <button
          onClick={handlePrint}
          style={{
            padding: "8px 15px",
            backgroundColor: "#0275d8",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🖨 Print
        </button>
      </div>

      <div style={{ width: "100%", padding: "10px" }}>
        {Object.entries(grouped).map(([function_name, items]) => (
          <div
            key={function_name}
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
              {function_name}
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                width="100%"
                border="1"
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  minWidth: "1100px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f1f1f1" }}>
                    <th style={thStyle}>ஊர்</th>
                    <th style={thStyle}>பெயர்</th>
                    <th style={thStyle}>பழைய பணம்</th>
                    <th style={thStyle}>புதிய பணம்</th>
                    <th style={thStyle}>தடவை</th>
                    <th style={thStyle}>திருமண விழா</th>
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
                      <td style={tdStyle}>{item.name}</td>
                      <td style={tdStyle}>{item.old_amount}</td>
                      <td style={tdStyle}>{item.new_amount}</td>
                      <td style={tdStyle}>{item.given_amount_status}</td>
                      <td style={tdStyle}>{item.function_name}</td>
                    </tr>
                  ))}

                  {/* Total Row */}
                  <tr style={{ backgroundColor: "#dff0d8" }}>
                    <td></td>
                    <td></td>
                    <td style={tdTotalStyle}>
                      மொத்தம் பழைய பணம்:{" "}
                      {items
                        .reduce(
                          (total, item) =>
                            total + parseFloat(item.old_amount || 0),
                          0
                        )
                        .toFixed(0)}
                    </td>
                    <td style={tdTotalStyle}>
                      மொத்தம் புதிய பணம்:{" "}
                      {items
                        .reduce(
                          (total, item) =>
                            total + parseFloat(item.new_amount || 0),
                          0
                        )
                        .toFixed(0)}
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
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
              margin: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            button {
              display: none !important;
            }
            table {
              width: 100% !important;
              min-width: 100% !important;
              font-size: 11px;
              border-collapse: collapse;
            }
            th, td {
              padding: 4px !important;
              word-wrap: break-word;
            }
            div[style*="overflow-x: auto"] {
              overflow: visible !important;
            }
            .navbar, .footer {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

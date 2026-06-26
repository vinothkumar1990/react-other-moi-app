import React, { useEffect, useState } from 'react';
import data from "../assets/pending.json";
import { Atom } from 'react-loading-indicators';
import "./Home.css";
import useData from "./custom-hook/useData";
import { useNavigate } from "react-router-dom";

export const PendingGroupRelo = () => {
  const navigate = useNavigate();
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

  // Load local fallback data initially
  useEffect(() => {
    const timer = setTimeout(() => {
      setMois(data);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Edit Function
  const handleEdit = (id) => {
    navigate(`/update_relo/${id}`);
  };

  // Filter pending records
  const filteredProducts =
    (products?.filter((item) => item.status === "Pending") ||
      mois.filter((item) => item.status === "Pending")) ?? [];

  // Group by name
  const grouped = filteredProducts.reduce((acc, curr) => {
    if (!acc[curr.name]) acc[curr.name] = [];
    acc[curr.name].push(curr);
    return acc;
  }, {});

  const thStyle = {
    padding: "6px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
  };
  const tdStyle = {
    padding: "6px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  };
  const tdTotalStyle = {
    padding: "6px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
    color: "#39740c",
    fontWeight: "bold",
  };

  const handlePrint = () => window.print();

  if (loading || isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Atom color="#32cd32" size="medium" />
      </div>
    );
  }

  return (
    <div className="pending-container">
      {/* Print button */}
      <div className="no-print" style={{ textAlign: "right", margin: "10px 20px" }}>
        <button
          onClick={handlePrint}
          style={{
            backgroundColor: "#0275d8",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🖨️ Print
        </button>
      </div>

      {/* Table Display */}
      <div style={{ width: "100%", padding: "10px" }}>
        {Object.entries(grouped).map(([name, items]) => (
          <div
            key={name}
            style={{
              marginBottom: "20px",
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
                style={{ borderCollapse: "collapse", width: "100%" }}
                border="1"
              >
                <thead>
                  <tr style={{ backgroundColor: "#f1f1f1" }}>
                    <th style={thStyle}>ஊர்</th>
                    <th style={thStyle}>பழைய பணம்</th>
                    <th style={thStyle}>புதிய பணம்</th>
                    <th style={thStyle}>தடவை</th>
                    <th style={thStyle}>திருமண விழா</th>
                    <th style={thStyle}>நிலை</th>
                    <th className="no-print" style={thStyle}></th>
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
                          color: item.status === "pending" ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {item.status === "pending"
                          ? "நிலுவையில் உள்ளது"
                          : "நிறைவு"}
                      </td>
                      <td className="no-print" style={tdStyle}>
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="btn btn-primary btn-sm"
                          style={{ marginRight: "5px" }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr
                    style={{
                      backgroundColor: "#dff0d8",
                      fontWeight: "bold",
                    }}
                  >
                    <td></td>
                    <td style={tdTotalStyle}>
                      மொத்தம்:{" "}
                      {items
                        .reduce(
                          (total, item) =>
                            total + parseFloat(item.old_amount || 0),
                          0
                        )
                        .toLocaleString("ta-IN")}
                    </td>
                    <td style={tdTotalStyle}>
                      மொத்தம்:{" "}
                      {items
                        .reduce(
                          (total, item) =>
                            total + parseFloat(item.new_amount || 0),
                          0
                        )
                        .toLocaleString("ta-IN")}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="no-print"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ PRINT STYLES */}
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
            background: white;
          }

          /* Hide non-print elements */
          .slides-section, .no-print, .navbar, .footer {
            display: none !important;
          }

          /* Ensure table formatting in print */
          table {
            width: 100% !important;
            min-width: 100% !important;
            font-size: 12px !important;
            border-collapse: collapse !important;
          }

          th, td {
            border: 1px solid #000 !important;
            padding: 8px !important;
            text-align: center !important;
          }

          /* Allow content overflow on print */
          div {
            overflow: visible !important;
          }
        }
      `}
      </style>
    </div>
  );
};

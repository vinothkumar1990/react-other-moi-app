
import React, { useEffect, useState } from 'react';
import data from "../assets/pending.json";
import { Atom } from 'react-loading-indicators';
import "./Home.css";
import useData from "./custom-hook/useData";
import { useNavigate } from "react-router-dom";

export const PendingPlaceGroup = () => {
  const navigate = useNavigate();

  // 🔥 Get logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userFunction = loggedInUser?.function_name || "";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setMois(data);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (id) => {
    navigate(`/update_relo/${id}`);
  };

  // 🔥 Apply filter: Pending + Same function_name as logged-in user
  const filteredProducts = (
    products?.filter(
      (item) => item.status === "Pending" && item.function_name === userFunction
    ) || mois.filter(
      (item) => item.status === "Pending" && item.function_name === userFunction
    )
  ) ?? [];

  const grouped = filteredProducts.reduce((acc, curr) => {
    if (!acc[curr.place]) acc[curr.place] = [];
    acc[curr.place].push(curr);
    return acc;
  }, {});

  const thStyle = {
    padding: "8px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
    backgroundColor: "#f1f1f1",
  };
  const tdStyle = {
    padding: "8px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  };
  const tdTotalStyle = {
    padding: "8px",
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

      <div style={{ width: "100%", padding: "10px" }}>
        {Object.entries(grouped).map(([place, items]) => (
          <div
            key={place}
            className="print-group"
            style={{
              marginBottom: "25px",
              border: "1px solid #aaa",
              borderRadius: "5px",
              overflow: "hidden",
              pageBreakInside: "avoid",
            }}
          >
            <div
              style={{
                backgroundColor: "#0275d8",
                color: "white",
                padding: "10px 15px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {place}
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }} border="1">
                <thead>
                  <tr>
                    <th style={thStyle}>ஊர்</th>
                    <th style={thStyle}>பெயர்</th>
                    <th style={thStyle}>பழைய பணம்</th>
                    <th style={thStyle}>புதிய பணம்</th>
                    <th style={thStyle}>தடவை</th>
                    <th style={thStyle}>திருமண விழா</th>
                    <th className="no-print" style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={item.id || index}
                      style={{ backgroundColor: index % 2 === 0 ? "#f9d9ec" : "#ebebeb" }}
                    >
                      <td style={tdStyle}>{item.place}</td>
                      <td style={tdStyle}>{item.name}</td>
                      <td style={tdStyle}>{item.old_amount}</td>
                      <td style={tdStyle}>{item.new_amount}</td>
                      <td style={tdStyle}>{item.given_amount_status}</td>
                      <td style={tdStyle}>{item.function_name}</td>
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

                  <tr style={{ backgroundColor: "#dff0d8", fontWeight: "bold" }}>
                    <td></td>
                    <td></td>
                    <td style={tdTotalStyle}>
                      மொத்தம்: {items.reduce((t, i) => t + parseFloat(i.old_amount || 0), 0).toLocaleString("ta-IN")}
                    </td>
                    <td style={tdTotalStyle}>
                      மொத்தம்: {items.reduce((t, i) => t + parseFloat(i.new_amount || 0), 0).toLocaleString("ta-IN")}
                    </td>
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

            <style>
        {`
        @media print {
          @page {
            size: A4 landscape;
            margin: 8mm;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
            font-size: 11px !important;
          }

          .no-print {
            display: none !important;
          }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 11px !important;
          }

          th, td {
            border: 1px solid #000 !important;
            padding: 6px !important;
            text-align: center !important;
          }

          th {
            background-color: #f1f1f1 !important;
            -webkit-print-color-adjust: exact !important;
          }

          .print-group {
            page-break-after: always !important;
            page-break-inside: avoid !important;
            margin-bottom: 20px !important;
          }
          .navbar, .footer {
              display: none !important;
            }
          div {
            overflow: visible !important;
          }
        }
      `}
      </style>
    </div>
  );
};

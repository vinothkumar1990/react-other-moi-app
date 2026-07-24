import React, { useEffect, useState } from "react";
import axios from "axios";
import { Commet } from "react-loading-indicators";
import { income_api } from "../utils/income-api";
import { outgoing_api } from "../utils/outgoing-api";
import { balance_api } from "../utils/balance-api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
const BASE_URL = "https://ievyooeawrzhkemxfswj.supabase.co/rest/v1";

const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI";

const HEADERS = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

export const DonationSummary = () => {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [balance, setBalance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ FETCH ALL DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes, balanceRes] = await Promise.all([
          income_api.get("/donation_income?select=*"),
          outgoing_api.get("/donation_outgoing?select=*"),
          balance_api.get("/balance?select=*"),
        ]);

        setIncome(incomeRes.data);
        setExpense(expenseRes.data);
        setBalance(balanceRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🌀 Loading animation
  if (isLoading) {
    return (
      <div style={{ marginTop: "50px" }}>
        <center>
          <Commet color="#d62560" size="large" text="Loading..." />
        </center>
      </div>
    );
  }

  // 🧮 Calculate totals
  const totalIncome = income.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );
  const totalExpense = expense.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );
  const totalDonation = income
    .filter((item) => item.type === "நன்கொடை")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalComman = income
    .filter((item) => item.type === "பொது")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  // 🧾 Get last year's balance (latest year from balance array)
  const lastYearBalance =
    balance.length > 0
      ? Number(balance[balance.length - 1].balance_amount || 0)
      : 0;

  // ✅ Calculate overall balance
  const kovil_balance = totalIncome - totalExpense;
  const totalFinalBalance = lastYearBalance + kovil_balance;

  // 💾 Download as CSV
  const downloadExcel = () => {
    const data = [
      {
        விவரம்: "நன்கொடை வரவு",
        தொகை: totalDonation,
      },
      {
        விவரம்: "பொது வரவு",
        தொகை: totalComman,
      },
      {
        விவரம்: "மொத்த வரவு",
        தொகை: totalIncome,
      },
      {
        விவரம்: "மொத்த செலவு",
        தொகை: totalExpense,
      },
      {
        விவரம்: "மொத்த மீதம்",
        தொகை: kovil_balance,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "மொத்த_வரவு_செலவு.xlsx");
  };

  // 🖨️ Print handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      style={{ padding: "30px", textAlign: "center" }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 8,
      }}
    >
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Header & Buttons */}
      <motion.div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 8,
        }}
      >
        <motion.button
          onClick={handlePrint}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
          whileHover={{
            scale: 1.08,
            y: -2,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          🖨️ Print
        </motion.button>

        <motion.button
          onClick={downloadExcel}
          style={{
            backgroundColor: "#0275d8",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          whileHover={{
            scale: 1.08,
            y: -2,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          📊 Download Excel
        </motion.button>
      </motion.div>

      {/* Summary Table */}
      <motion.table
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          borderCollapse: "collapse",
          border: "1px solid #ccc",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead style={{ backgroundColor: "#0275d8", color: "white" }}>
          <tr>
            <th
              colSpan="2"
              style={{
                padding: "15px",
                fontSize: "22px",
                background:
                  "linear-gradient(90deg,rgb(182, 23, 31),rgb(26, 9, 73))",
              }}
            >
              மொத்த வரவு செலவு
            </th>
          </tr>
        </thead>
        <tbody>
          <motion.tr
            style={{ backgroundColor: "#e0ffe0" }}
            whileHover={{
              scale: 1.08,
              y: -2,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            <td style={{ padding: "12px", fontWeight: "bold" }}>
              நன்கொடை வரவு
            </td>
            <td
              style={{ padding: "12px", color: "#007b00", fontWeight: "bold" }}
            >
              ₹ {totalDonation.toLocaleString("ta-IN")}
            </td>
          </motion.tr>
          <motion.tr
            style={{ backgroundColor: "#e0ffe0" }}
            whileHover={{
              scale: 1.08,
              y: -2,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            <td style={{ padding: "12px", fontWeight: "bold" }}>பொது வரவு</td>
            <td
              style={{ padding: "12px", color: "#007b00", fontWeight: "bold" }}
            >
              ₹ {totalComman.toLocaleString("ta-IN")}
            </td>
          </motion.tr>
          <motion.tr
            style={{ backgroundColor: "#e0ffe0" }}
            whileHover={{
              scale: 1.08,
              y: -2,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            <td style={{ padding: "12px", fontWeight: "bold" }}>மொத்த வரவு</td>
            <td
              style={{ padding: "12px", color: "#007b00", fontWeight: "bold" }}
            >
              ₹ {totalIncome.toLocaleString("ta-IN")}
            </td>
          </motion.tr>
          <motion.tr
            style={{ backgroundColor: "#ffe0e0" }}
            whileHover={{
              scale: 1.08,
              y: -2,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            <td style={{ padding: "12px", fontWeight: "bold" }}>மொத்த செலவு</td>
            <td style={{ padding: "12px", color: "#c00", fontWeight: "bold" }}>
              ₹ {totalExpense.toLocaleString("ta-IN")}
            </td>
          </motion.tr>
          <motion.tr
            style={{ backgroundColor: "#f0f0f0" }}
            whileHover={{
              scale: 1.08,
              y: -2,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            <td style={{ padding: "12px", fontWeight: "bold" }}>மொத்த மீதம்</td>
            <td
              style={{
                padding: "12px",
                color: kovil_balance >= 0 ? "#007b00" : "#c00",
                fontWeight: "bold",
              }}
            >
              ₹ {kovil_balance.toLocaleString("ta-IN")}
            </td>
          </motion.tr>
        </tbody>
      </motion.table>

      {/* 🖨️ Print styles */}
      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              margin: 0;
              padding: 0;
              font-family: 'Noto Sans Tamil', sans-serif;
              text-align: center;
              width: 100%;
            }

            .no-print {
              display: none !important;
            }
            .navbar, .footer {
              display: none !important;
            }

            html, body {
              height: 100%;
              overflow: visible !important;
            }

            table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin-top: 20px;
            }

            th, td {
              border: 1px solid #000 !important;
              padding: 10px;
              font-size: 16px;
              word-wrap: break-word;
            }

            th {
              background-color: #0275d8 !important;
              color: white !important;
            }

            tr:nth-child(2) td { background-color: #e0ffe0 !important; }
            tr:nth-child(3) td { background-color: #ffe0e0 !important; }
            tr:nth-child(4) td { background-color: #fff0cc !important; }
            tr:nth-child(5) td { background-color: #f0f0f0 !important; }
            tr:nth-child(6) td { background-color: #d6f5ff !important; }

            @page {
              size: A4 landscape;
              margin: 10mm;
            }
          }
        `}
      </style>
    </motion.div>
  );
};

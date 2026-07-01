
import React, { useEffect, useState } from 'react';
import data from "../assets/pending.json";
import { Atom } from 'react-loading-indicators';
import "./Home.css";
import useData from "./custom-hook/useData";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
     <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
        }}
      >
          <motion.div
        className="no-print"
        initial={{
          y: -40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
        }}
        style={{
          textAlign: "right",
          margin: "10px",
        }}
      >
        <motion.button
          whileHover={{
            scale: 1.08,
            y: -2,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={handlePrint}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(90deg,#1976D2,#42A5F5)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 10px 20px rgba(0,0,0,.2)",
          }}
        >
          🖨️ Print Page
        </motion.button>
      </motion.div>

      <div style={{ width: "100%", padding: "10px" }}>
        {Object.entries(grouped).map(([place, items]) => (
          <motion.div
            key={place}
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            style={{
              marginBottom: "30px",
              border: "1px solid #aaa",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{
                x: -50,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              transition={{
                duration: 0.5,
              }}
              style={{
                background: "linear-gradient(90deg,#1976D2,#42A5F5)",
                color: "#fff",
                padding: "12px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
                          {place}
                        </motion.div>
            

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
              }}
              style={{
                overflowX: "auto",
              }}
            >
              <table style={{
borderCollapse:"collapse",
minWidth:"1200px",
fontSize:"14px",
boxShadow:"0 10px 20px rgba(0,0,0,.15)",
borderRadius:"10px"
}} border="1">
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
                    <motion.tr
                      key={item.id || index}
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}>
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
                    </motion.tr>
                  ))}

                   <motion.tr
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      delay: 0.8,
                    }}
                    style={{
                      backgroundColor: "#dff0d8",
                      fontWeight: "bold",
                    }}
                  >
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
                  </motion.tr>
                </tbody>
              </table>
            </motion.div>
          </motion.div>
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
    </motion.div>
  );
};

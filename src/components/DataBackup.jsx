import React, { useEffect, useRef, useState } from "react";
import useData from "./custom-hook/useData";
import { useNavigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import axios from "axios";
import Swal from "sweetalert2";
import "./Home.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const DataBackup = () => {
  const navigate = useNavigate();

  // 🔥 Get logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const [selectedFunction, setSelectedFunction] = useState("All");

  const { products, error, isLoading, setProducts } = useData(
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

  const lastRowRef = useRef(null);

  useEffect(() => {
    if (lastRowRef.current) {
      lastRowRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [products.length]);

  // DELETE
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `https://ievyooeawrzhkemxfswj.supabase.co/rest/v1/mois?id=eq.${id}`,
            {
              headers: {
                apikey:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI",
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI",
                "Content-Type": "application/json",
              },
            }
          )
          .then(() => {
            setProducts(products.filter((p) => p.id !== id));
            Swal.fire("Deleted!", "Record removed.", "success");
          })
          .catch(() => {
            Swal.fire("Error!", "Something went wrong.", "error");
          });
      }
    });
  };

  const handleEdit = (id) => navigate(`/update_relo/${id}`);

  const functionNames = [
  "All",
  ...new Set(
    products
      .map((item) => item.function_name)
      .filter(Boolean)
  ),
];

  // 🔥 FILTERING LOGIC  
  // Admin → show all  
  // Normal user → only their function_name records
  const roleBasedProducts =
  loggedInUser?.role === "admin"
    ? products
    : products.filter(
        (item) => item.function_name === loggedInUser?.function_name
      );

const filteredProducts =
  selectedFunction === "All"
    ? roleBasedProducts
    : roleBasedProducts.filter(
        (item) => item.function_name === selectedFunction
      );
  const sortedProducts = [...filteredProducts].sort(
  (a, b) => new Date(a.created_at) - new Date(b.created_at)
);

  // Total calculation
  const totalOldAmount = sortedProducts.reduce(
    (sum, item) => sum + Number(item.old_amount || 0),
    0
  );
  const totalNewAmount = sortedProducts.reduce(
    (sum, item) => sum + Number(item.new_amount || 0),
    0
  );
  console.log(sortedProducts)
  // Export CSV
  const exportToExcel = () => {
  const excelData = sortedProducts.map((item) => ({
    "name": item.name || "",
    "place": item.place || "",
    "old_amount": Number(item.old_amount || 0),
    "new_amount": Number(item.new_amount || 0),
    "given_amount_status": item.given_amount_status || "",
    "function_name": item.function_name || "",
    "status": item.status || ""
  }));

  // Total Row
  //excelData.push({
    //"ஊர்": "",
    //"பெயர்": "மொத்தம்",
    //"பழைய பணம்": totalOldAmount,
    //"புதிய பணம்": totalNewAmount,
    //"தடவை": "",
    //"திருமண விழா": ""
  //});

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Column Widths
  worksheet["!cols"] = [
    { wch: 20 }, // ஊர்
    { wch: 30 }, // பெயர்
    { wch: 15 }, // பழைய பணம்
    { wch: 15 }, // புதிய பணம்
    { wch: 15 }, // தடவை
    { wch: 30 }  // திருமண விழா
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "மொய் பட்டியல்"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const blob = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
  );

  const today = new Date().toISOString().split("T")[0];

const fileName =
  selectedFunction === "All"
    ? `All_Functions_${today}.xlsx`
    : `${selectedFunction
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^\w]/g, "")}_${today}.xlsx`;

saveAs(blob, fileName);
};

  const handlePrint = () => window.print();

  if (isLoading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <OrbitProgress color="#32cd32" size="medium" />
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        ⚠️ Error: {error.message}
      </div>
    );

  const thStyle = {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
    color: "white",
  };
  const tdStyle = { padding: "10px", borderBottom: "1px solid #eee" };
  const tdTotalStyle = {
    padding: "10px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#39740c",
  };

  return (
    <div style={{ padding: "10px" }}>
      {/* BUTTONS */}
      <div
  className="no-print action-container"
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "flex-end",
    alignItems: "center",
    margin: "20px",
    padding: "15px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
  }}
>
  <select
    value={selectedFunction}
    onChange={(e) => setSelectedFunction(e.target.value)}
    style={{
      minWidth: "250px",
      maxWidth: "350px",
      width: "100%",
      padding: "14px 18px",
      borderRadius: "15px",
      border: "2px solid #4facfe",
      background: "linear-gradient(135deg,#ffffff,#f7faff)",
      fontSize: "15px",
      fontWeight: "600",
      color: "#333",
      outline: "none",
      cursor: "pointer",
      transition: "all .3s ease",
      boxShadow: "0 5px 15px rgba(79,172,254,.15)",
    }}
  >
    {functionNames.map((name, index) => (
      <option key={index} value={name}>
        {name}
      </option>
    ))}
  </select>

  <button
    onClick={exportToExcel}
    style={{
      background:
        "linear-gradient(135deg,#00c853,#00e676)",
      color: "#fff",
      border: "none",
      borderRadius: "15px",
      padding: "14px 24px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "15px",
      transition: ".3s",
      boxShadow: "0 5px 15px rgba(0,200,83,.3)",
    }}
    onMouseOver={(e) =>
      (e.currentTarget.style.transform =
        "translateY(-3px)")
    }
    onMouseOut={(e) =>
      (e.currentTarget.style.transform =
        "translateY(0)")
    }
  >
    📊 Download Backup Excel
  </button>

  <button
    onClick={handlePrint}
    style={{
      background:
        "linear-gradient(135deg,#1976d2,#42a5f5)",
      color: "#fff",
      border: "none",
      borderRadius: "15px",
      padding: "14px 24px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "15px",
      transition: ".3s",
      boxShadow: "0 5px 15px rgba(25,118,210,.3)",
    }}
    onMouseOver={(e) =>
      (e.currentTarget.style.transform =
        "translateY(-3px)")
    }
    onMouseOut={(e) =>
      (e.currentTarget.style.transform =
        "translateY(0)")
    }
  >
    🖨 Print Page
  </button>
</div>

      {/* TABLE */}
      <div style={{ overflowX: "auto" }}>
        <table width="100%" border="1" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#0275d8" }}>
              <th style={thStyle}>ஊர்</th>
              <th style={thStyle}>பெயர்</th>
              <th style={thStyle}>பழைய பணம்</th>
              <th style={thStyle}>புதிய பணம்</th>
              <th style={thStyle}>தடவை</th>
              <th style={thStyle}>திருமண விழா</th>
              <th className="no-print" style={thStyle}></th>
              <th className="no-print" style={thStyle}></th>
            </tr>
          </thead>

          <tbody>
            {sortedProducts.map((item, index) => (
              <tr
                key={item.id}
                ref={index === sortedProducts.length - 1 ? lastRowRef : null}
                style={{
                  textAlign: "center",
                  backgroundColor: index % 2 === 0 ? "#f7d4e7" : "#e2e2e2",
                }}
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
                  >
                    Edit
                  </button>
                </td>

                <td className="no-print" style={tdStyle}>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* TOTAL */}
            <tr style={{ backgroundColor: "#d1ecf1" }}>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}>மொத்தம்</td>
              <td style={tdTotalStyle}>{totalOldAmount}</td>
              <td style={tdTotalStyle}>{totalNewAmount}</td>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}></td>
              <td className="no-print" style={tdTotalStyle}></td>
              <td className="no-print" style={tdTotalStyle}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PRINT CSS */}
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

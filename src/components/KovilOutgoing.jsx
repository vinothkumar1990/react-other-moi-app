import React, { useEffect, useState } from 'react';
import { Slab } from "react-loading-indicators";
import useFetch from "./custom-hook/useFetch";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { outgoing_api } from "../utils/outgoing-api";
import '../styles/print1.css';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export const KovilOutgoing = () => {
  const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
  
    // ✅ GET DATA
      const fetchData = async () => {
        try {
          setIsLoading(true);
    
          const res = await outgoing_api.get('/outgoing?select=*');
          setProducts(res.data || []);
    
        } catch (err) {
          console.error(err);
          setError("Failed to fetch data");
        } finally {
          setIsLoading(false);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);
    
      // ✅ DELETE
      const handleDelete = (id) => {
        Swal.fire({
          title: "Are you sure?",
          text: "Delete this record?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes"
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await outgoing_api.delete(`/outgoing?id=eq.${id}`);
    
              Swal.fire("Deleted!", "", "success");
              fetchData();
    
            } catch (err) {
              console.error(err);
              Swal.fire("Error!", "Delete failed", "error");
            }
          }
        });
      };
  

  const handleEdit = (id) => {
    navigate(`/update_outgoing/${id}`);
  };

  const totalAmount = products.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const downloadExcel = () => {
  const excelData = products.map((item) => ({
    "தேதி": item.date
      ? dayjs(item.date).format("DD-MM-YYYY")
      : "",
    "பெயர்": item.name || "",
    "தொகை": Number(item.amount || 0),
    "வகை": item.type || "",
    "விளக்கம்": item.description || ""
  }));

  // Total Row
  excelData.push({
    "தேதி": "",
    "பெயர்": "மொத்த செலவு",
    "தொகை": totalAmount,
    "வகை": "",
    "விளக்கம்": ""
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Column Widths
  worksheet["!cols"] = [
    { wch: 15 }, // தேதி
    { wch: 30 }, // பெயர்
    { wch: 15 }, // தொகை
    { wch: 20 }, // வகை
    { wch: 50 }  // விளக்கம்
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "மொத்த செலவு"
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

  saveAs(blob, "கோவில்_செலவு.xlsx");
};

  const handlePrint = () => window.print();

  const thStyle = {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
    color: "white",
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  };

  const tdTotalStyle = {
    padding: "10px",
    textAlign: "center",
    color: "#39740c",
    fontWeight: "bold",
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <Slab
          color="#d62560"
          size="large"
          text="loading..."
          textColor="#000"
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      
      {/* BUTTONS */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        <button
          onClick={() => navigate("/newOutgoing")}
          className="btn btn-primary"
          style={{
            backgroundColor: "#0275d8",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            fontWeight: "bold",
            minWidth: "120px",
          }}
        >
          ➕ Add New
        </button>

        <button
  onClick={downloadExcel}
  className="btn btn-success"
  style={{
    backgroundColor: "#28a745",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    fontWeight: "bold",
    minWidth: "120px",
  }}
>
  📊 Download Excel
</button>

        <button
          onClick={handlePrint}
          className="btn btn-secondary"
          style={{
            backgroundColor: "#6c757d",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            fontWeight: "bold",
            minWidth: "120px",
          }}
        >
          🖨️ Print Page
        </button>
      </div>

      {/* TABLE */}
      <div style={{ overflowX: "auto", maxWidth: "100%", margin: "0 auto" }}>
        <table
          width="100%"
          style={{
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {/* FIXED THEAD */}
          <thead>
            <tr style={{ backgroundColor: "#0275d8", color: "white" }}>
              <th colSpan="8" style={{ padding: "15px", fontSize: "22px" }}>
                மொத்த செலவு
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: "20px", color: "gray" }}>
                  No outgoing records found.
                </td>
              </tr>
            ) : (
              products.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#f2f2f2",
                  }}
                >
                  <td style={tdStyle}>{item.date ? dayjs(item.date).format("DD-MM-YYYY") : "-"}</td>
                  <td style={tdStyle}>{item.name}</td>
                  <td style={tdStyle}>{item.amount}</td>
                  <td style={tdStyle}>{item.type}</td>
                  <td style={tdStyle}>{item.description}</td>
                  <td style={tdStyle} className="no-print">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: "#0275d8", border: "none" }}
                    >
                      Edit
                    </button>
                  </td>
                  <td style={tdStyle} className="no-print">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-danger btn-sm"
                      style={{ backgroundColor: "#d9534f", border: "none" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}

            {/* TOTAL ROW */}
            {products.length > 0 && (
              <tr style={{ backgroundColor: "#d1ecf1" }}>
                <td style={tdTotalStyle}></td>
                <td style={tdTotalStyle} colSpan="4">
                  மொத்த செலவு: ₹{totalAmount.toLocaleString("ta-IN")}
                </td>
                <td className="no-print"></td>
                <td className="no-print"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

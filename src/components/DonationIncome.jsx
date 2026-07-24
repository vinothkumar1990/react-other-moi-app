import React, { useEffect, useState } from "react";
import { Commet } from "react-loading-indicators";
import useFetch from "./custom-hook/useFetch";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { income_api } from "../utils/income-api";
import "../styles/print1.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";

export const DonationIncome = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ GET DATA
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const res = await income_api.get("/donation_income?select=*");
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
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await income_api.delete(`/donation_income?id=eq.${id}`);

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
    navigate(`/update_donation_income/${id}`);
  };

  // ✅ Calculate total amount
  const totalAmount = products.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  // ✅ CSV download
  const downloadExcel = () => {
    const excelData = products.map((item) => ({
      ஊர்: item.place || "",
      பெயர்: item.name || "",
      தொகை: item.amount || 0,
      தேதி: item.date ? dayjs(item.date).format("DD-MM-YYYY") : "",
      "வரவு வகை": item.type || "",
      விளக்கம்: item.description || "",
    }));

    // Total Row
    excelData.push({
      ஊர்: "",
      பெயர்: "மொத்த வரவு",
      தொகை: totalAmount,
      தேதி: "",
      "வரவு வகை": "",
      விளக்கம்: "",
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 40 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "மொத்த வரவு");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "மொத்த_வரவு.xlsx");
  };

  // ✅ Print page
  const handlePrint = () => {
    window.print();
  };

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
    borderBottom: "1px solid #eee",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <Commet
          color="#d62560"
          size="large"
          text="loading..."
          textColor="#000"
        />
      </div>
    );
  }

  return (
    <motion.div
      style={{ padding: "20px", textAlign: "center" }}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ✅ Action Buttons */}
      <motion.div
        style={{
          marginBottom: "25px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
        }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.button
          onClick={() => navigate("/donation/income/new")}
          className="btn btn-primary"
          style={{
            backgroundColor: "#0275d8",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
          whileHover={{
            scale: 1.08,
            y: -2,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          ➕ Add New
        </motion.button>

        <motion.button
          onClick={downloadExcel}
          className="btn btn-success"
          style={{
            padding: "8px 16px",
            borderRadius: "5px",
            fontWeight: "bold",
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

        <motion.button
          onClick={handlePrint}
          className="btn btn-info"
          style={{
            padding: "8px 16px",
            borderRadius: "5px",
            fontWeight: "bold",
            backgroundColor: "#17a2b8",
            border: "none",
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
      </motion.div>

      {/* ✅ Table Wrapper */}
      <motion.div
        className="print-table-wrapper"
        style={{ overflowX: "auto", maxWidth: "100%", margin: "0 auto" }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.table
          width="100%"
          className="print-table"
          style={{
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
            borderRadius: "10px",
            overflow: "hidden",
            fontSize: "14px",
          }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <thead style={{ backgroundColor: "#0275d8", color: "white" }}>
            <tr>
              <th
                colSpan="10"
                style={{
                  padding: "15px",
                  fontSize: "22px",
                  background:
                    "linear-gradient(90deg,rgb(220 19 83),rgb(11 93 81))",
                }}
              >
                மொத்த வரவு
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "gray",
                  }}
                >
                  No income records found.
                </td>
              </tr>
            ) : (
              products.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ecd1e0" : "#c5def3",
                  }}
                >
                  <td style={tdStyle}>{item.place}</td>
                  <td style={tdStyle}>{item.name}</td>
                  <td style={tdStyle}>{item.amount}</td>
                  <td style={tdStyle}>
                    {item.date ? dayjs(item.date).format("DD-MM-YYYY") : "-"}
                  </td>
                  <td style={tdStyle}>{item.type}</td>
                  <td style={tdStyle}>{item.description}</td>
                  <td style={tdStyle} className="no-print">
                    <motion.button
                      onClick={() => handleEdit(item.id)}
                      className="btn btn-primary btn-sm"
                      style={{
                        marginRight: "5px",
                        backgroundColor: "#0275d8",
                        border: "none",
                      }}
                      whileHover={{
                        scale: 1.08,
                        y: -2,
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                    >
                      Edit
                    </motion.button>
                  </td>
                  <td style={tdStyle} className="no-print">
                    <motion.button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-danger btn-sm"
                      style={{ backgroundColor: "#d9534f", border: "none" }}
                      whileHover={{
                        scale: 1.08,
                        y: -2,
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                    >
                      Delete
                    </motion.button>
                  </td>
                </tr>
              ))
            )}
            {products.length > 0 && (
              <tr style={{ backgroundColor: "#137243", color: "white" }}>
                <td style={tdTotalStyle}></td>
                <td style={tdTotalStyle} colSpan="5">
                  மொத்த வரவு: ₹{totalAmount.toLocaleString("ta-IN")}
                </td>
                <td style={tdTotalStyle} className="no-print"></td>
                <td style={tdTotalStyle} className="no-print"></td>
              </tr>
            )}
          </tbody>
        </motion.table>
      </motion.div>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </motion.div>
  );
};

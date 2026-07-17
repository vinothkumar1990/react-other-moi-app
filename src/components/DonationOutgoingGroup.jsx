import React, { useEffect, useState } from "react";
import { Mosaic } from "react-loading-indicators";
import { income_api } from "../utils/income-api";
import Swal from "sweetalert2";
import "../styles/kovil-print.css";
import { motion } from "framer-motion";

export const DonationOutgoingGroup = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const res = await income_api.get("/donation_outgoing?select=*");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Fetch failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Group by type
  const grouped = products.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push(curr);
    return acc;
  }, {});

  // Date Format DD-MM-YYYY
  const formatDate = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const thStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    textAlign: "center",
    backgroundColor: "#e6eaeb",
    color: "green",
    fontWeight: "bold",
  };

  const tdStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
  };

  const tdTotalStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
    fontWeight: "bold",
    color: "#39740c",
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <center>
          <Mosaic color="#d62560" size="large" text="" textColor="" />
        </center>
      </div>
    );
  }

  return (
    <motion.div
      style={{ padding: "10px" }}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "15px",
        }}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.button
          onClick={handlePrint}
          className="btn btn-success"
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

      {Object.entries(grouped).map(([type, items]) => {
        // Amount decending Order
        const sortedItems = [...items].sort(
          (a, b) => Number(b.amount || 0) - Number(a.amount || 0),
        );

        const totalAmount = sortedItems.reduce(
          (total, item) => total + Number(item.amount || 0),
          0,
        );

        return (
          <motion.div
            key={type}
            style={{
              marginBottom: "30px",
              border: "1px solid #aaa",
              borderRadius: "5px",
              overflow: "hidden",
            }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              style={{
                backgroundColor: "#0275d8",
                color: "white",
                padding: "10px 15px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {type}
            </motion.div>

            <motion.table
              width="100%"
              style={{
                borderCollapse: "collapse",
                width: "100%",
              }}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <tbody>
                {sortedItems.map((item, index) => (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f7d4e7" : "#e2e2e2",
                    }}
                  >
                    <td style={tdStyle}>{item.place}</td>
                    <td style={tdStyle}>{item.name}</td>
                    <td style={tdStyle}>
                      ₹{Number(item.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td style={tdStyle}>{formatDate(item.date)}</td>
                    <td style={tdStyle}>{item.description}</td>
                  </tr>
                ))}

                <tr
                  style={{
                    backgroundColor: "#dff0d8",
                  }}
                >
                  <td colSpan="2" style={tdTotalStyle}>
                    மொத்தம்
                  </td>

                  <td style={tdTotalStyle}>
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </td>

                  <td style={tdTotalStyle}></td>
                  <td style={tdTotalStyle}></td>
                </tr>
              </tbody>
            </motion.table>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

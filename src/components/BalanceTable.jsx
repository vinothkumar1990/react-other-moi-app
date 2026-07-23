import React from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/BalanceAllProvider";
export const BalanceTable = () => {
    const {
        products,
        handleDelete,
        handleEdit,
        thStyle,
        tdStyle,
        totalAmount,
      } = useContext(MoiContext);
    
  return (
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
        <thead>
          <tr style={{ backgroundColor: "#0275d8" }}>
            <th style={{ ...thStyle, textAlign: "center" }} colSpan="4">
              மொத்த மீதம்
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
                No records found.
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
                <td style={tdStyle}>{item.year}</td>
                <td style={tdStyle}>{item.balance_amount}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="btn btn-primary btn-sm"
                    style={{
                      backgroundColor: "#0275d8",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      color: "white",
                    }}
                  >
                    Edit
                  </button>
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-danger btn-sm"
                    style={{
                      backgroundColor: "#d9534f",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      color: "white",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

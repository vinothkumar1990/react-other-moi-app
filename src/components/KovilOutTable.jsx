import React from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/KovilOutAllProvider";
export const KovilOutTable = () => {
  const {
    products,
    handleDelete,
    handleEdit,
    thStyle,
    tdStyle,
    tdTotalStyle,
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
                <td style={tdStyle}>
                  {item.date ? dayjs(item.date).format("DD-MM-YYYY") : "-"}
                </td>
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
  );
};

import React from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/KovilAllProvider";
export const KovilAllListTable = () => {
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
    <div className="print-table-wrapper">
      <table className="print-table">
        <thead style={{ backgroundColor: "#0275d8", color: "white" }}>
          <tr>
            <th
              colSpan="8"
              style={{
                padding: "15px",
                fontSize: "22px",
                background:
                  "linear-gradient(90deg,rgb(14, 107, 68),rgb(211, 198, 18))",
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
                colSpan="8"
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
                  backgroundColor: index % 2 === 0 ? "#f7e999" : "#ebb6b6",
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
                    style={{
                      marginRight: "5px",
                      backgroundColor: "#0275d8",
                      border: "none",
                    }}
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
          {products.length > 0 && (
            <tr style={{ backgroundColor: "#07323a" }}>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle} colSpan="4">
                மொத்த வரவு: ₹{totalAmount.toLocaleString("ta-IN")}
              </td>
              <td style={tdTotalStyle} className="no-print"></td>
              <td style={tdTotalStyle} className="no-print"></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

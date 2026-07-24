import React from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/KovilOutAllProvider";

export const KovilOutGroupTable = ({ grouped }) => {
  const { tdStyle, tdTotalStyle } = useContext(MoiContext);
  return (
    <div style={{ width: "100%" }}>
      {Object.entries(grouped).map(([type, items]) => (
        <div
          key={type}
          style={{
            marginBottom: "30px",
            border: "1px solid #aaa",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg,rgb(220 19 83),rgb(11 93 81))",
              color: "white",
              padding: "10px 15px",
              fontSize: "18px",
            }}
          >
            {type}
          </div>

          <div>
            <table
              width="100%"
              style={{
                borderCollapse: "collapse",
                tableLayout: "fixed",
                width: "100%",
              }}
            >
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f7d4e7" : "#e2e2e2",
                      textAlign: "center",
                    }}
                  >
                    <td style={tdStyle}>{item.name}</td>
                    <td style={tdStyle}>{item.amount}</td>
                    <td style={tdStyle}>{item.type}</td>
                    <td style={tdStyle}>{item.description}</td>
                  </tr>
                ))}

                {/* 🧾 Total Row */}
                <tr
                  style={{
                    backgroundColor: "#dff0d8",
                    textAlign: "center",
                  }}
                >
                  <td style={tdTotalStyle}>மொத்தம்</td>
                  <td style={tdTotalStyle}>
                    {items.reduce(
                      (total, item) => total + parseFloat(item.amount || 0),
                      0,
                    )}
                  </td>
                  <td style={tdTotalStyle}></td>
                  <td style={tdTotalStyle}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

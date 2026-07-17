import React from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/MoiAllGroupProvider";
export const StatusGroupTable = ({ items }) => {
  const { thStyle, tdStyle, tdTotalStyle } = useContext(MoiContext);
  return (
    <table
      width="100%"
      border="1"
      style={{
        borderCollapse: "collapse",
        minWidth: "1200px",
        fontSize: "14px",
        boxShadow: "0 10px 20px rgba(0,0,0,.15)",
        borderRadius: "10px",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#f1f1f1" }}>
          <th style={thStyle}>ஊர்</th>
          <th style={thStyle}>பெயர்</th>
          <th style={thStyle}>பழைய பணம்</th>
          <th style={thStyle}>புதிய பணம்</th>
          <th style={thStyle}>தடவை</th>
          <th style={thStyle}>திருமண விழா</th>
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
            }}
          >
            <td style={tdStyle}>{item.place}</td>
            <td style={tdStyle}>{item.name}</td>
            <td style={tdStyle}>{item.old_amount}</td>
            <td style={tdStyle}>{item.new_amount}</td>
            <td style={tdStyle}>{item.given_amount_status}</td>
            <td style={tdStyle}>{item.function_name}</td>
          </motion.tr>
        ))}

        {/* Total Row */}
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
            மொத்தம் பழைய பணம்:{" "}
            {items
              .reduce(
                (total, item) => total + parseFloat(item.old_amount || 0),
                0,
              )
              .toFixed(0)}
          </td>
          <td style={tdTotalStyle}>
            மொத்தம் புதிய பணம்:{" "}
            {items
              .reduce(
                (total, item) => total + parseFloat(item.new_amount || 0),
                0,
              )
              .toFixed(0)}
          </td>
          <td></td>
          <td></td>
        </motion.tr>
      </tbody>
    </table>
  );
};

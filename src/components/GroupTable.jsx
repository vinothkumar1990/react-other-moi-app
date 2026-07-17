import React from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/MoiAllGroupProvider";
export const GroupTable = ({ items }) => {
  const { thStyle, tdStyle, tdTotalStyle, navigate, handleEdit } =
    useContext(MoiContext);
  return (
    <table
      style={{
        borderCollapse: "collapse",
        minWidth: "1200px",
        fontSize: "14px",
        boxShadow: "0 10px 20px rgba(0,0,0,.15)",
        borderRadius: "10px",
      }}
      border="1"
    >
      <thead>
        <tr>
          <th style={thStyle}>ஊர்</th>
          <th style={thStyle}>பெயர்</th>
          <th style={thStyle}>பழைய பணம்</th>
          <th style={thStyle}>புதிய பணம்</th>
          <th style={thStyle}>தடவை</th>
          <th style={thStyle}>திருமண விழா</th>
          <th style={thStyle}>நிலை</th>
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
            }}
          >
            <td style={tdStyle}>{item.place}</td>
            <td style={tdStyle}>{item.name}</td>
            <td style={tdStyle}>{item.old_amount}</td>
            <td style={tdStyle}>{item.new_amount}</td>
            <td style={tdStyle}>{item.given_amount_status}</td>
            <td style={tdStyle}>{item.function_name}</td>
            {/* Status Column */}
            <td
              style={{
                ...tdStyle,
                color: item.status === "pending" ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {item.status === "Pending" ? "நிலுவையில் உள்ளது" : "நிறைவு"}
            </td>
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
            மொத்தம்:{" "}
            {items
              .reduce((t, i) => t + parseFloat(i.old_amount || 0), 0)
              .toLocaleString("ta-IN")}
          </td>
          <td style={tdTotalStyle}>
            மொத்தம்:{" "}
            {items
              .reduce((t, i) => t + parseFloat(i.new_amount || 0), 0)
              .toLocaleString("ta-IN")}
          </td>
          <td></td>
          <td></td>
          <td className="no-print"></td>
        </motion.tr>
      </tbody>
    </table>
  );
};

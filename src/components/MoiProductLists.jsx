import React from "react";
import { motion } from "framer-motion";
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import { useContext } from "react";
import { MoiContext } from "../context/MoiAllProvider";

export const MoiProductLists = () => {
  const {
    products,
    error,
    isLoading,
    lastRowRef,
    filteredProducts,
    sortedProducts,
    totalNewAmount,
    totalOldAmount,
    exportToExcel,
    handlePrint,
    loggedInUser,
    tdTotalStyle,
    thStyle,
    tdStyle,
    handleDelete,
    handleEdit,
    navigate,
  } = useContext(MoiContext);
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.6,
      }}
      style={{
        padding: "10px",
      }}
    >
      {/* BUTTONS */}
      <motion.div
        initial={{
          y: -40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
        }}
        className="no-print"
        style={{
          textAlign: "right",
          margin: "10px 20px",
        }}
      >
        <motion.button
          whileHover={{
            scale: 1.08,
            y: -2,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={exportToExcel}
          style={{
            background: "linear-gradient(90deg,#43A047,#66BB6A)",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            marginRight: "10px",
            fontWeight: "bold",
            fontSize: "15px",
            boxShadow: "0 10px 20px rgba(0,0,0,.2)",
          }}
        >
          📥 Export Excel
        </motion.button>

        <motion.button
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={handlePrint}
          style={{
            background: "linear-gradient(90deg,#1976D2,#42A5F5)",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 10px 20px rgba(0,0,0,.2)",
            marginLeft: "10px",
          }}
        >
          🖨️ Print
        </motion.button>
      </motion.div>

      {/* TABLE */}
      <motion.div
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 0.4,
        }}
        style={{
          overflowX: "auto",
        }}
      >
        <table width="100%" border="1" style={{ borderCollapse: "collapse" }}>
          <thead>
            <motion.tr
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 1,
              }}
              style={{
                backgroundColor: "#5d48d1",
              }}
            >
              <th style={thStyle}>ஊர்</th>
              <th style={thStyle}>பெயர்</th>
              <th style={thStyle}>பழைய பணம்</th>
              <th style={thStyle}>புதிய பணம்</th>
              <th style={thStyle}>தடவை</th>
              <th style={thStyle}>திருமண விழா</th>
              <th className="no-print" style={thStyle}></th>
              <th className="no-print" style={thStyle}></th>
            </motion.tr>
          </thead>

          <tbody>
            {sortedProducts.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{
                  opacity: 0,
                  x: -30,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
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
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    onClick={() => handleEdit(item.id)}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </motion.button>
                </td>

                <td className="no-print" style={tdStyle}>
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </motion.button>
                </td>
              </motion.tr>
            ))}

            {/* TOTAL */}
            <motion.tr
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 1,
              }}
              style={{
                backgroundColor: "#d1ecf1",
              }}
            >
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}>மொத்தம்</td>
              <td style={tdTotalStyle}>{totalOldAmount}</td>
              <td style={tdTotalStyle}>{totalNewAmount}</td>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}></td>
              <td className="no-print" style={tdTotalStyle}></td>
              <td className="no-print" style={tdTotalStyle}></td>
            </motion.tr>
          </tbody>
        </table>
      </motion.div>

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
    </motion.div>
  );
};

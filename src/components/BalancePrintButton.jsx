import React from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/BalanceAllProvider";
export const BalancePrintButton = () => {
  const { handlePrint, downloadCSV, navigate } = useContext(MoiContext);
  return (
    <div
      style={{
        marginBottom: "25px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      <button
        onClick={() => navigate("/new/balance")}
        className="btn btn-primary"
        style={{
          backgroundColor: "#0275d8",
          border: "none",
          padding: "10px 18px",
          borderRadius: "6px",
          fontWeight: "bold",
          color: "white",
        }}
      >
        ➕ Add New
      </button>

      <button
        onClick={downloadCSV}
        className="btn btn-success"
        style={{
          backgroundColor: "#28a745",
          border: "none",
          padding: "10px 18px",
          borderRadius: "6px",
          fontWeight: "bold",
          color: "white",
        }}
      >
        📄 Download CSV
      </button>

      <button
        onClick={handlePrint}
        className="btn btn-info"
        style={{
          backgroundColor: "#17a2b8",
          border: "none",
          padding: "10px 18px",
          borderRadius: "6px",
          fontWeight: "bold",
          color: "white",
        }}
      >
        🖨️ Print
      </button>
    </div>
  );
};

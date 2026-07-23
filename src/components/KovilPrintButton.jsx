import React from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/KovilAllProvider";
export const KovilPrintButton = () => {
  const { handlePrint, downloadExcel, navigate } = useContext(MoiContext);
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
        onClick={() => navigate("/newIncome")}
        className="btn btn-primary"
        style={{
          backgroundColor: "#0275d8",
          border: "none",
          padding: "8px 16px",
          borderRadius: "5px",
          fontWeight: "bold",
        }}
      >
        ➕ Add New
      </button>

      <button
        onClick={downloadExcel}
        className="btn btn-success"
        style={{
          padding: "8px 16px",
          borderRadius: "5px",
          fontWeight: "bold",
        }}
      >
        📊 Download Excel
      </button>

      <button
        onClick={handlePrint}
        className="btn btn-info"
        style={{
          padding: "8px 16px",
          borderRadius: "5px",
          fontWeight: "bold",
          backgroundColor: "#17a2b8",
          border: "none",
        }}
      >
        🖨️ Print
      </button>
    </div>
  );
};

import React from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/KovilOutAllProvider";
export const KovilOutPrint = () => {
  const { handlePrint, downloadExcel, navigate } = useContext(MoiContext);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "25px",
      }}
    >
      <button
        onClick={() => navigate("/newOutgoing")}
        className="btn btn-primary"
        style={{
          backgroundColor: "#0275d8",
          border: "none",
          padding: "8px 16px",
          borderRadius: "5px",
          fontWeight: "bold",
          minWidth: "120px",
        }}
      >
        ➕ Add New
      </button>

      <button
        onClick={downloadExcel}
        className="btn btn-success"
        style={{
          backgroundColor: "#28a745",
          border: "none",
          padding: "8px 16px",
          borderRadius: "5px",
          fontWeight: "bold",
          minWidth: "120px",
        }}
      >
        📊 Download Excel
      </button>

      <button
        onClick={handlePrint}
        className="btn btn-secondary"
        style={{
          backgroundColor: "#6c757d",
          border: "none",
          padding: "8px 16px",
          borderRadius: "5px",
          fontWeight: "bold",
          minWidth: "120px",
        }}
      >
        🖨️ Print Page
      </button>
    </div>
  );
};

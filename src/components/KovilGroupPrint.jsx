import React from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/KovilAllProvider";
export const KovilGroupPrint = () => {
  const { handlePrint } = useContext(MoiContext);
  return (
    <div
      className="no-print"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <button
        onClick={handlePrint}
        className="btn btn-success"
        style={{ marginBottom: "10px" }}
      >
        🖨️ Print
      </button>
    </div>
  );
};

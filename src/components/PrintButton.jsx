import React from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/MoiAllGroupProvider";
export const PrintButton = () => {
  const { handlePrint, navigate } = useContext(MoiContext);
  return (
    <motion.div
      className="no-print"
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
      style={{
        textAlign: "right",
        margin: "10px",
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
        onClick={handlePrint}
        style={{
          padding: "10px 20px",
          background: "linear-gradient(90deg,#1976D2,#42A5F5)",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 10px 20px rgba(0,0,0,.2)",
        }}
      >
        🖨️ Print Page
      </motion.button>
    </motion.div>
  );
};

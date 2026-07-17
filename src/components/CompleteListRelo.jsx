import React, { useEffect, useState } from "react";
import { BlinkBlur } from "react-loading-indicators";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/MoiAllGroupProvider";
import "./Home.css";
import { PrintButton } from "./PrintButton";
import { StatusGroupTable } from "./StatusGroupTable";

export const CompleteListRelo = () => {
  const {
    loggedInUser,
    userFunction,
    products,
    error,
    isLoading,
    filteredComProducts,
    com_grouped,
    thStyle,
    tdStyle,
    tdTotalStyle,
    handlePrint,
    navigate,
    handleEdit,
  } = useContext(MoiContext);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <center>
          <BlinkBlur color="#32cd32" size="medium" text="" textColor="" />
        </center>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
        Completed records not found for your function: <b>{loggedFunction}</b>
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.8,
      }}
    >
      <PrintButton />

      <div style={{ width: "100%", padding: "10px" }}>
        {Object.entries(com_grouped).map(([function_name, items]) => (
          <motion.div
            key={function_name}
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            style={{
              marginBottom: "30px",
              border: "1px solid #aaa",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{
                x: -50,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              transition={{
                duration: 0.5,
              }}
              style={{
                background: "linear-gradient(90deg,#1976D2,#42A5F5)",
                color: "#fff",
                padding: "12px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {function_name} - முடிக்கப்பட்ட மொய் பட்டியல்
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
              }}
              style={{
                overflowX: "auto",
              }}
            >
              <StatusGroupTable items={items} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

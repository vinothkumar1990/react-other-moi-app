import React, { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/MoiAllGroupProvider";
import "./Home.css";
import { PrintButton } from "./PrintButton";
import { GroupTable } from "./GroupTable";

export const PendingPlaceGroup = () => {
  const {
    loggedInUser,
    userFunction,
    products,
    error,
    isLoading,
    filteredProducts,
    grouped,
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
        <Atom color="#32cd32" size="medium" />
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
        {Object.entries(grouped).map(([place, items]) => (
          <motion.div
            key={place}
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
                color: "rgb(255, 255, 255)",
                padding: "12px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {place}
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
              <GroupTable items={items} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

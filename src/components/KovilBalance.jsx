import React, { useEffect, useState } from "react";
import { Riple } from "react-loading-indicators";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/BalanceAllProvider";
import "../styles/print1.css";
import { BalancePrintButton } from "./BalancePrintButton";
import { BalanceTable } from "./BalanceTable";
export const KovilBalance = () => {
  const { products, error, isLoading } = useContext(MoiContext);
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <Riple
          color="#d62560"
          size="large"
          text="loading..."
          textColor="#000"
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <BalancePrintButton />
      <BalanceTable />

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

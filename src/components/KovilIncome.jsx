import React, { useEffect, useState } from "react";
import { Commet } from "react-loading-indicators";
import useFetch from "./custom-hook/useFetch";
import Swal from "sweetalert2";
import "../styles/print1.css";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/KovilAllProvider";
import { KovilAllListTable } from "./KovilAllListTable";
import { KovilPrintButton } from "./KovilPrintButton";

export const KovilIncome = () => {
  const { products, error, isLoading } = useContext(MoiContext);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <Commet
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
      <KovilPrintButton />

      <KovilAllListTable />

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

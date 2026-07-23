import React, { useEffect, useState } from "react";
import { Mosaic } from "react-loading-indicators";
import Swal from "sweetalert2";
import "../styles/print.css";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/KovilAllProvider";
import { KovilIIncomeGroupTable } from "./KovilIIncomeGroupTable";
import { KovilGroupPrint } from "./KovilGroupPrint";
export const IncomeGroup = () => {
  const { isLoading, grouped } = useContext(MoiContext);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <center>
          <Mosaic color="#d62560" size="large" text="" textColor="" />
        </center>
      </div>
    );
  } else {
    return (
      <div style={{ padding: "10px" }}>
        <KovilGroupPrint />
        <KovilIIncomeGroupTable grouped={grouped} />
      </div>
    );
  }
};

import React, { useEffect, useState } from "react";
import { LifeLine } from "react-loading-indicators";
import Swal from "sweetalert2";
import "../styles/print.css";
import { KovilGroupPrint } from "./KovilGroupPrint";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/KovilOutAllProvider";
import { KovilOutGroupTable } from "./KovilOutGroupTable";
export const OutgoingGroup = () => {
  const { isLoading, grouped, handlePrint } = useContext(MoiContext);
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <center>
          <LifeLine color="#d62560" size="large" text="" textColor="" />
        </center>
      </div>
    );
  } else {
    return (
      <div style={{ padding: "10px" }}>
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
        <KovilOutGroupTable grouped={grouped} />
      </div>
    );
  }
};

import React, { useEffect, useState } from "react";
import { Slab } from "react-loading-indicators";
import useFetch from "./custom-hook/useFetch";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import "../styles/print1.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/KovilOutAllProvider";
import { KovilOutTable } from "./KovilOutTable";
import { KovilOutPrint } from "./KovilOutPrint";

export const KovilOutgoing = () => {
  const {
    products,
    error,
    isLoading,
    handleDelete,
    handleEdit,
    handlePrint,
    thStyle,
    tdStyle,
    tdTotalStyle,
    totalAmount,
    downloadExcel,
    navigate,
  } = useContext(MoiContext);
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <Slab color="#d62560" size="large" text="loading..." textColor="#000" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <KovilOutPrint />
      <KovilOutTable />
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

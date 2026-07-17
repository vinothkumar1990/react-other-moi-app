import React, { useEffect, useRef } from "react";
import useData from "./custom-hook/useData";

import { OrbitProgress } from "react-loading-indicators";
import "./Home.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { income_api } from "../utils/income-api";
import apiFetch from "./custom-hook/apiFetch";
import { useContext } from "react";
import { MoiContext } from "../context/MoiAllProvider";
import { MoiProductLists } from "./MoiProductLists";

export const Relo = () => {
  const {
    products,
    error,
    isLoading,
    lastRowRef,
    filteredProducts,
    sortedProducts,
    totalNewAmount,
    totalOldAmount,
    exportToExcel,
    handlePrint,
    loggedInUser,
    tdTotalStyle,
    thStyle,
    tdStyle,
    handleDelete,
    handleEdit,
    navigate,
  } = useContext(MoiContext);

  if (isLoading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <OrbitProgress color="#32cd32" size="medium" />
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        ⚠️ Error: {error.message}
      </div>
    );

  return <MoiProductLists />;
};

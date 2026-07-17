import React, { useEffect, useState, useMemo, useCallback } from "react";
import ReactPaginate from "react-paginate";

import { Atom } from "react-loading-indicators";
import "./Home.css";
import { Slides } from "./Slides";
import { HomeGrouped } from "./HomeGrouped";
import { income_api } from "../utils/income-api";
import apiFetch from "./custom-hook/apiFetch";

export const Home = ({ cart, setCart }) => {
  // Logged in user

  const loggedInUser = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser"));
  }, []);
  const userFunction = useMemo(() => {
    return loggedInUser?.function_name || "";
  }, []);

  // Fetch data from Supabase
  const { products, error, isLoading } = apiFetch(() =>
    income_api.get("/mois?select=*"),
  );

  const [loadingLocal, setLoadingLocal] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 10;
  const activeData = products;
  const filteredData = useMemo(() => {
    if (loggedInUser?.role === "admin") {
      return products;
    }

    return products.filter(
      (item) =>
        item.function_name?.trim().toLowerCase() ===
        userFunction.trim().toLowerCase(),
    );
  }, [products, loggedInUser, userFunction]);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const offset = currentPage * itemsPerPage;

    return filteredData.slice(offset, offset + itemsPerPage);
  }, [filteredData, currentPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Fallback JSON loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingLocal(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Group by name
  const grouped = useMemo(() => {
    return currentItems.reduce((acc, curr) => {
      if (!acc[curr.function_name]) {
        acc[curr.function_name] = [];
      }

      acc[curr.function_name].push(curr);

      return acc;
    }, {});
  }, [currentItems]);

  const thStyle = {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  };

  const tdTotalStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
    color: "#39740c",
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (isLoading || loadingLocal) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <center>
          <Atom color="#32cd32" size="medium" />
        </center>
      </div>
    );
  }

  if (error) {
    return (
      <p style={{ color: "red", textAlign: "center" }}>Error loading data.</p>
    );
  }

  return (
    <div>
      {/* Slides Section */}
      <div className="slides-section">
        <Slides />
      </div>
      <HomeGrouped
        grouped={grouped}
        userFunction={userFunction}
        thStyle={thStyle}
        tdStyle={tdStyle}
        tdTotalStyle={tdTotalStyle}
        pageCount={pageCount}
        handlePageClick={handlePageClick}
      />
      {/* PRINT STYLES */}
      <style>
        {`
        @media print {
          @page {
            size: landscape;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .slides-section, .no-print {
            display: none !important;
          }
        }
      `}
      </style>
    </div>
  );
};

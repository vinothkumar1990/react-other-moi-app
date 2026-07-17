import {
  createContext,
  useState,
  useRef,
  useCallback,
  memo,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useData from "../components/custom-hook/useData";

export const MoiContext = createContext();

export const MoiAllProvider = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const { products, error, isLoading, setProducts } = useData(
    "https://ievyooeawrzhkemxfswj.supabase.co/rest/v1/mois",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI",
        "Content-Type": "application/json",
      },
    },
  );
  console.log(products);
  const lastRowRef = useRef(null);

  useEffect(() => {
    if (lastRowRef.current) {
      lastRowRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [products.length]);

  const filteredProducts =
    loggedInUser?.role === "admin"
      ? products
      : products.filter(
          (item) => item.function_name === loggedInUser?.function_name,
        );
  const sortedProducts = [...filteredProducts].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );

  // Total calculation
  const totalOldAmount = sortedProducts.reduce(
    (sum, item) => sum + Number(item.old_amount || 0),
    0,
  );
  const totalNewAmount = sortedProducts.reduce(
    (sum, item) => sum + Number(item.new_amount || 0),
    0,
  );
  console.log(sortedProducts);
  // Export CSV
  const exportToExcel = () => {
    const excelData = sortedProducts.map((item) => ({
      ஊர்: item.place || "",
      பெயர்: item.name || "",
      "பழைய பணம்": Number(item.old_amount || 0),
      "புதிய பணம்": Number(item.new_amount || 0),
      தடவை: item.given_amount_status || "",
      "திருமண விழா": item.function_name || "",
    }));

    // Total Row
    excelData.push({
      ஊர்: "",
      பெயர்: "மொத்தம்",
      "பழைய பணம்": totalOldAmount,
      "புதிய பணம்": totalNewAmount,
      தடவை: "",
      "திருமண விழா": "",
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Column Widths
    worksheet["!cols"] = [
      { wch: 20 }, // ஊர்
      { wch: 30 }, // பெயர்
      { wch: 15 }, // பழைய பணம்
      { wch: 15 }, // புதிய பணம்
      { wch: 15 }, // தடவை
      { wch: 30 }, // திருமண விழா
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "மொய் பட்டியல்");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "மொய்_பட்டியல்.xlsx");
  };

  const handlePrint = () => window.print();
  const thStyle = {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
    color: "white",
  };
  const tdStyle = { padding: "10px", borderBottom: "1px solid #eee" };
  const tdTotalStyle = {
    padding: "10px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#39740c",
  };
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `https://ievyooeawrzhkemxfswj.supabase.co/rest/v1/mois?id=eq.${id}`,
            {
              headers: {
                apikey:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI",
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI",
                "Content-Type": "application/json",
              },
            },
          )
          .then(() => {
            setProducts(products.filter((p) => p.id !== id));
            Swal.fire("Deleted!", "Record removed.", "success");
          })
          .catch(() => {
            Swal.fire("Error!", "Something went wrong.", "error");
          });
      }
    });
  };

  const handleEdit = (id) => navigate(`/update_relo/${id}`);
  const navigate = useNavigate();
  return (
    <MoiContext.Provider
      value={{
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
      }}
    >
      {children}
    </MoiContext.Provider>
  );
};

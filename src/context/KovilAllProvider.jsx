import {
  createContext,
  useState,
  useRef,
  useCallback,
  memo,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import Swal from "sweetalert2";
import { income_api } from "../utils/income-api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useData from "../components/custom-hook/useFetch";

export const MoiContext = createContext();

export const KovilAllProvider = ({ children }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ GET DATA
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const res = await income_api.get("/income?select=*");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ DELETE
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await income_api.delete(`/income?id=eq.${id}`);

          Swal.fire("Deleted!", "", "success");
          fetchData();
        } catch (err) {
          console.error(err);
          Swal.fire("Error!", "Delete failed", "error");
        }
      }
    });
  };
  const handleEdit = (id) => {
    navigate(`/update_income/${id}`);
  };

  // ✅ Calculate total amount
  const totalAmount = products.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  // ✅ Print page
  const handlePrint = () => {
    window.print();
  };

  // ✅ CSV download
  const downloadExcel = () => {
    const excelData = products.map((item) => ({
      தேதி: item.date ? dayjs(item.date).format("DD-MM-YYYY") : "",
      பெயர்: item.name || "",
      தொகை: Number(item.amount || 0),
      "வரவு வகை": item.type || "",
      விளக்கம்: item.description || "",
    }));

    // Total Row
    excelData.push({
      தேதி: "",
      பெயர்: "மொத்த வரவு",
      தொகை: totalAmount,
      "வரவு வகை": "",
      விளக்கம்: "",
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Column Widths
    worksheet["!cols"] = [
      { wch: 15 }, // தேதி
      { wch: 30 }, // பெயர்
      { wch: 15 }, // தொகை
      { wch: 20 }, // வகை
      { wch: 50 }, // விளக்கம்
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "மொத்த வரவு");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "கோவில்_வரவு.xlsx");
  };

  const thStyle = {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
    color: "white",
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
    fontWeight: "bold",
  };
  const grouped = products.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push(curr);
    return acc;
  }, {});

  // 🧮 GROUP BY DATE
  const grouped_date = products.reduce((acc, curr) => {
    if (!acc[curr.date]) {
      acc[curr.date] = [];
    }

    acc[curr.date].push(curr);

    return acc;
  }, {});

  return (
    <MoiContext.Provider
      value={{
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
        grouped,
        grouped_date,
      }}
    >
      {children}
    </MoiContext.Provider>
  );
};

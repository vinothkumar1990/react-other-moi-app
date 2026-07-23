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
import { balance_api } from "../utils/balance-api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useData from "../components/custom-hook/useFetch";

export const MoiContext = createContext();

export const BalanceAllProvider = ({ children }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ GET DATA
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const res = await balance_api.get("/balance?select=*");
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
          await balance_api.delete(`/balance?id=eq.${id}`);

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
    navigate(`/update_balance/${id}`);
  };

  const totalAmount = products.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  // ✅ CSV download
  const downloadCSV = () => {
    const rows = products.map((item) => [
      item.name,
      item.amount,
      item.type,
      item.description,
    ]);
    rows.push(["மொத்த வரவு", totalAmount, "", ""]);
    let csvContent = "\uFEFF" + [...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "மொத்த_வரவுsss.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Print page
  const handlePrint = () => {
    window.print();
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
        totalAmount,
        downloadCSV,
        navigate,
      }}
    >
      {children}
    </MoiContext.Provider>
  );
};

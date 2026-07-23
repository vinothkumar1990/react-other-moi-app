import {
  createContext,
  useState,
  useRef,
  useCallback,
  memo,
  useEffect,
  useContext,
} from "react";
import useData from "../components/custom-hook/useData";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../config/config.js";
export const MoiContext = createContext();

export const MoiAllGroupProvider = ({ children }) => {
  const navigate = useNavigate();

  // 🔥 Get logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const userFunction = loggedInUser?.function_name || "";

  const { products, error, isLoading, setProducts } = useData(
    `${API_CONFIG.BASE_URL}/rest/v1/mois`,
    {
      headers: {
        apikey: API_CONFIG.API_KEY,
        Authorization: `Bearer ${API_CONFIG.API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  const handleEdit = (id) => {
    navigate(`/update_relo/${id}`);
  };

  // filter pending group start
  const filteredProducts =
    products?.filter((item) =>
      loggedInUser?.role === "admin"
        ? item.status === "Pending"
        : item.status === "Pending" && item.function_name === userFunction,
    ) || [];

  const grouped = filteredProducts.reduce((acc, curr) => {
    const key =
      loggedInUser?.role === "admin" ? curr.function_name : curr.place;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(curr);
    return acc;
  }, {});

  // filter pending group end

  // filter completed group start

  const filteredCompleteProducts =
    products?.filter((item) =>
      loggedInUser?.role === "admin"
        ? item.status === "Completed"
        : item.status === "Completed" && item.function_name === userFunction,
    ) || [];

  const complete_grouped = filteredCompleteProducts.reduce((acc, curr) => {
    const key =
      loggedInUser?.role === "admin" ? curr.function_name : curr.place;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(curr);
    return acc;
  }, {});

  // Filter Completed group end

  // Filter place group start

  const filteredPlaceProducts =
    products?.filter((item) =>
      loggedInUser?.role === "admin"
        ? true
        : item.function_name === userFunction,
    ) || [];

  const place_grouped = filteredPlaceProducts.reduce((acc, curr) => {
    const key =
      loggedInUser?.role === "admin" ? curr.function_name : curr.place;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(curr);
    return acc;
  }, {});

  // filter place group end

  // filter pending group start

  const filteredPendingProducts = (products.length > 0 ? products : [])
    .filter((item) => item.status?.toLowerCase() === "pending")
    .filter((item) => item.function_name === userFunction);

  const pending_grouped = filteredPendingProducts.reduce((acc, curr) => {
    const key = curr.function_name || "Others";
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  // filter pending group end

  const filteredComProducts = (products.length > 0 ? products : [])
    .filter((item) => item.status?.toLowerCase() === "completed")
    .filter((item) => item.function_name === userFunction);

  const com_grouped = filteredComProducts.reduce((acc, curr) => {
    const key = curr.function_name || "Others";
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  // status group start
  const status_grouped = filteredPlaceProducts.reduce((acc, curr) => {
    if (!acc[curr.given_amount_status]) acc[curr.given_amount_status] = [];
    acc[curr.given_amount_status].push(curr);
    return acc;
  }, {});
  // status group end

  const thStyle = {
    padding: "8px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
    backgroundColor: "#f1f1f1",
  };
  const tdStyle = {
    padding: "8px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  };
  const tdTotalStyle = {
    padding: "8px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
    color: "#39740c",
    fontWeight: "bold",
  };

  const handlePrint = () => window.print();

  return (
    <MoiContext.Provider
      value={{
        loggedInUser,
        userFunction,
        products,
        error,
        isLoading,
        filteredProducts,
        grouped,
        thStyle,
        tdStyle,
        tdTotalStyle,
        handlePrint,
        navigate,
        handleEdit,
        filteredCompleteProducts,
        complete_grouped,
        filteredPlaceProducts,
        place_grouped,
        filteredPendingProducts,
        pending_grouped,
        filteredComProducts,
        com_grouped,
        status_grouped,
      }}
    >
      {children}
    </MoiContext.Provider>
  );
};

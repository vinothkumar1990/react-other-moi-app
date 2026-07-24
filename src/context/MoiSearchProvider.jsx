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
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  TextField,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Button,
} from "@mui/material";
export const MoiContext = createContext();
import { API_CONFIG } from "../config/config.js";
export const MoiSearchProvider = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userFunctionName = loggedInUser?.function_name || "";

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [nameSearch, setNameSearch] = useState("");
  const [placeSearch, setPlaceSearch] = useState("");
  const [listeningField, setListeningField] = useState(null);
  const navigate = useNavigate();
  const columns = [
    { field: "place", headerName: "ஊர்", width: 230 },
    { field: "name", headerName: "பெயர்", width: 300 },
    { field: "old_amount", headerName: "பழைய பணம்", width: 150 },
    { field: "new_amount", headerName: "புதிய பணம்", width: 150 },
    { field: "given_amount_status", headerName: "தடவை", width: 90 },
    { field: "function_name", headerName: "திருமண விழா", width: 250 },
    {
      field: "status",
      headerName: "நிலை",
      width: 200,
      renderCell: (params) => (
        <span
          style={{
            color: params.value === "Pending" ? "orange" : "green",
            fontWeight: "bold",
          }}
        >
          {params.value === "Pending" ? "நிலுவையில் உள்ளது" : "நிறைவு"}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => navigate(`/update_relo/${params.id}`)}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];
  const rows = (products || []).map((row, index) => ({
    id: row.id || index + 1,
    ...row,
  }));
  //const functionFilteredRows = rows.filter(
  //(item) => item.function_name === userFunctionName,
  //);

  const functionFilteredRows =
    rows?.filter((item) =>
      loggedInUser?.role === "admin"
        ? true
        : item.function_name === userFunctionName,
    ) || [];

  const statusFilteredRows =
    statusFilter === "all"
      ? functionFilteredRows
      : functionFilteredRows.filter((r) => r.status === statusFilter);
  const finalFilteredRows = statusFilteredRows.filter((row) => {
    const name = row.name?.toLowerCase() || "";
    const place = row.place?.toLowerCase() || "";

    const nameQuery = nameSearch.toLowerCase();
    const placeQuery = placeSearch.toLowerCase();

    if (!nameQuery && !placeQuery) return true;
    if (nameQuery && !placeQuery) return name.includes(nameQuery);
    if (!nameQuery && placeQuery) return place.includes(placeQuery);

    return name.includes(nameQuery) && place.includes(placeQuery);
  });
  const totalRecords = finalFilteredRows.length;
  const completedCount = finalFilteredRows.filter(
    (item) => item.status === "Completed",
  ).length;
  const pendingCount = finalFilteredRows.filter(
    (item) => item.status === "Pending",
  ).length;
  const newAmount = finalFilteredRows.reduce(
    (sum, item) => sum + Number(item.new_amount || 0),

    0,
  );

  const oldAmount = finalFilteredRows.reduce(
    (sum, item) => sum + Number(item.old_amount || 0),

    0,
  );
  const totalAmount = newAmount + oldAmount;

  const totalPendingAmount = finalFilteredRows
    .filter((item) => item.status === "Pending")
    .reduce((sum, item) => {
      return sum + Number(item.new_amount || 0);
    }, 0);

  const totalCompletedAmount = finalFilteredRows
    .filter((item) => item.status === "Completed")
    .reduce((sum, item) => {
      return sum + Number(item.new_amount || 0);
    }, 0);
  return (
    <MoiContext.Provider
      value={{
        loggedInUser,
        userFunctionName,
        products,
        error,
        isLoading,
        rows,
        functionFilteredRows,
        statusFilteredRows,
        finalFilteredRows,
        name,
        totalRecords,
        completedCount,
        pendingCount,
        newAmount,
        oldAmount,
        totalAmount,
        totalPendingAmount,
        totalCompletedAmount,
        nameSearch,
        placeSearch,
        listeningField,
        setStatusFilter,
        setNameSearch,
        setPlaceSearch,
        setListeningField,
        statusFilter,
        columns,
      }}
    >
      {children}
    </MoiContext.Provider>
  );
};

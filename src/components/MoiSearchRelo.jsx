import React, { useState, useRef, useCallback, memo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Atom } from "react-loading-indicators";
import useData from "./custom-hook/useData";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { motion } from "framer-motion";

// -------------------
// Columns
// -------------------
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
];

const paginationModel = { page: 0, pageSize: 20 };

// -------------------
// INPUT WITH MIC
// -------------------
const SearchInput = memo(
  ({
    label,
    value,
    setValue,
    field,
    onMicClick,
    stopVoice,
    listeningField,
  }) => {
    const isListening = listeningField === field;

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          fullWidth
          label={label}
          value={value}
          onChange={(e) => {
            stopVoice();
            setValue(e.target.value);
          }}
          onFocus={stopVoice}
          size="small"
        />

        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onMicClick(field);
          }}
          size="small"
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            height: "40px",
            width: "40px",
            backgroundColor: isListening ? "#ffe6e6" : "#e3f2fd",
          }}
        >
          <motion.div
            animate={{
              scale: isListening ? [1, 1.4, 1] : 1,
            }}
            transition={{
              repeat: isListening ? Infinity : 0,
              duration: 1,
            }}
          >
            <MicIcon color={isListening ? "error" : "primary"} />
          </motion.div>
        </IconButton>
      </Box>
    );
  }
);

// -------------------
// MAIN COMPONENT
// -------------------
export const MoiSearchRelo = () => {
  const { products, error, isLoading } = useData(
    "https://ievyooeawrzhkemxfswj.supabase.co/rest/v1/mois",
    {
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI",
       "Content-Type": "application/json",
      },
    }
  );

  const [statusFilter, setStatusFilter] = useState("all");
  const [nameSearch, setNameSearch] = useState("");
  const [placeSearch, setPlaceSearch] = useState("");
  const [listeningField, setListeningField] = useState(null);

  const recognitionRef = useRef(null);

  // 🎤 START VOICE
  const startVoiceSearch = useCallback((field) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Voice not supported");

    if (recognitionRef.current) recognitionRef.current.stop();

    const recognition = new SpeechRecognition();
    recognition.lang = "ta-IN";
    recognition.start();

    setListeningField(field);
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      if (field === "name") setNameSearch(text);
      if (field === "place") setPlaceSearch(text);
    };

    recognition.onend = () => setListeningField(null);
  }, []);

  // 🎤 STOP VOICE
  const stopVoice = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListeningField(null);
  }, []);

  // LOADING
  if (isLoading) {
    return (
      <Box textAlign="center" mt={5}>
        <Atom color="#32cd32" size="medium" />
      </Box>
    );
  }

  if (error) {
    return <div style={{ color: "red" }}>⚠️ {error.message}</div>;
  }

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userFunctionName = loggedInUser?.function_name || "";

  const rows = (products || []).map((row, index) => ({
    id: row.id || index + 1,
    ...row,
  }));

  const functionFilteredRows = rows.filter(
    (item) => item.function_name === userFunctionName
  );

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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* FILTER */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          p: 2,
        }}
      >
        <SearchInput
          label="பெயர் தேடல்"
          value={nameSearch}
          setValue={setNameSearch}
          field="name"
          onMicClick={startVoiceSearch}
          stopVoice={stopVoice}
          listeningField={listeningField}
        />

        <SearchInput
          label="ஊர் தேடல்"
          value={placeSearch}
          setValue={setPlaceSearch}
          field="place"
          onMicClick={startVoiceSearch}
          stopVoice={stopVoice}
          listeningField={listeningField}
        />

        <FormControl fullWidth>
          <InputLabel>நிலை</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="all">அனைத்தும்</MenuItem>
            <MenuItem value="Pending">நிலுவையில் உள்ளது</MenuItem>
            <MenuItem value="Completed">நிறைவு</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* TABLE */}
      <Paper sx={{ width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={finalFilteredRows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[20, 50, 100]}
          autoHeight
        />
      </Paper>
    </motion.div>
  );
};
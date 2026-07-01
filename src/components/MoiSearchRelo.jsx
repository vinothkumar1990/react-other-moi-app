import React, { useState, useRef, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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
  Typography,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import MicIcon from "@mui/icons-material/Mic";
import { motion } from "framer-motion";






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
  size="small"
  onChange={(e) => {
    stopVoice();
    setValue(e.target.value);
  }}
  onFocus={stopVoice}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon color="primary" />
      </InputAdornment>
    ),
  }}
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
  const navigate = useNavigate();
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
  {
  field: "action",
  headerName: "Action",
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

const paginationModel = { page: 0, pageSize: 20 };

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
  const totalRecords = finalFilteredRows.length;
  const completedCount =
finalFilteredRows.filter(
item => item.status==="Completed"
).length;
const pendingCount =
finalFilteredRows.filter(
item=>item.status==="Pending"
).length;
const newAmount =
finalFilteredRows.reduce(

(sum,item)=>

sum + Number(item.new_amount || 0),

0

);

const oldAmount =
finalFilteredRows.reduce(

(sum,item)=>

sum + Number(item.old_amount || 0),

0

);
const totalAmount = newAmount + oldAmount

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <Box
  sx={{
    background: "linear-gradient(90deg,#1565c0,#42a5f5)",
    color: "#fff",
    p: 3,
    borderRadius: 3,
    mb: 3,
    boxShadow: 4,
  }}
>
  <Typography
    variant="h4"
    fontWeight="bold"
  >
    🎉 மொய் பதிவுகளை தேடவும் மற்றும் நிர்வகிக்கவும்.
  </Typography>

  {/*<Typography
    variant="body1"
    sx={{ mt: 1 }}
  >
    மொய் பதிவுகளை தேடவும், Filter செய்யவும் மற்றும் நிர்வகிக்கவும்.
  </Typography>*/}
</Box>
{/* ================= Dashboard Cards ================= */}

<Grid container spacing={2} sx={{ mb: 3 }}>

  {/* Total Records */}

  <Grid item xs={12} sm={6} md={3}>
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        background: "#E3F2FD",
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          color="text.secondary"
        >
          📋 மொத்த மொய்
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
        >
          {totalRecords}
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  {/* Completed */}

  <Grid item xs={12} sm={6} md={3}>
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        background: "#E8F5E9",
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          color="text.secondary"
        >
          ✅ நிறைவு
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="success.main"
        >
          {completedCount}
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  {/* Pending */}

  <Grid item xs={12} sm={6} md={3}>
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        background: "#FFF8E1",
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          color="text.secondary"
        >
          ⏳ நிலுவையில்
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="warning.main"
        >
          {pendingCount}
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  {/* old Amount */}

  <Grid item xs={12} sm={6} md={3}>
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        background: "#F3E5F5",
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          color="text.secondary"
        >
          💰 பழைய மொத்த தொகை
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="secondary"
        >
          ₹ {oldAmount.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
{/* new Amount */}

  <Grid item xs={12} sm={6} md={3}>
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        background: "#F3E5F5",
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          color="text.secondary"
        >
          💰 புதிய மொத்த தொகை
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="secondary"
        >
          ₹ {newAmount.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  {/* Total Amount */}

  <Grid item xs={12} sm={6} md={3}>
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        background: "#F3E5F5",
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          color="text.secondary"
        >
          💰 மொத்த தொகை
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="secondary"
        >
          ₹ {totalAmount.toLocaleString()}
          </Typography>
            </CardContent>
          </Card>
        </Grid>

       {/* pending Amount */}
  <Grid item xs={12} sm={6} md={3}>
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        background: "#F3E5F5",
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          color="text.secondary"
        >
          💰 நிலுவையில் உள்ள மொத்த தொகை
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="secondary"
        >
          ₹ {totalPendingAmount.toLocaleString()}
          </Typography>
            </CardContent>
          </Card>
        </Grid>
{/* Completed Amount */}

  <Grid item xs={12} sm={6} md={3}>
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        background: "#F3E5F5",
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          color="text.secondary"
        >
          💰 நிறைவு செய்த மொத்த தொகை
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="secondary"
        >
          ₹ {totalCompletedAmount.toLocaleString()}
          </Typography>
            </CardContent>
          </Card>
        </Grid>

</Grid>
      {/* FILTER */}
<Card
  elevation={5}
  sx={{
    borderRadius: 4,
    mb: 3,
    p: 1,
  }}
>
  <CardContent>
    <Typography
      variant="h6"
      fontWeight="bold"
      mb={3}
    >
      🔍 தேடல்
    </Typography>

    <Grid container spacing={2}>
      {/* Name Search */}

      <Grid item xs={12} md={4}>
        <SearchInput
          label="பெயர் தேடல்"
          value={nameSearch}
          setValue={setNameSearch}
          field="name"
          onMicClick={startVoiceSearch}
          stopVoice={stopVoice}
          listeningField={listeningField}
        />
      </Grid>

      {/* Place Search */}

      <Grid item xs={12} md={4}>
        <SearchInput
          label="ஊர் தேடல்"
          value={placeSearch}
          setValue={setPlaceSearch}
          field="place"
          onMicClick={startVoiceSearch}
          stopVoice={stopVoice}
          listeningField={listeningField}
        />
      </Grid>

      {/* Status */}

      <Grid item xs={12} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>நிலை</InputLabel>

          <Select
            value={statusFilter}
            label="நிலை"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">அனைத்தும்</MenuItem>

            <MenuItem value="Pending">
              நிலுவையில்
            </MenuItem>

            <MenuItem value="Completed">
              நிறைவு
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Clear Button */}

      <Grid
        item
        xs={12}
        md={2}
        display="flex"
        alignItems="center"
      >
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<RestartAltIcon />}
          sx={{ height: 40 }}
          onClick={() => {
            setNameSearch("");
            setPlaceSearch("");
            setStatusFilter("all");
            stopVoice();
          }}
        >
          Clear
        </Button>
      </Grid>
    </Grid>
  </CardContent>
</Card>

      {/* TABLE */}
      <Paper
  elevation={6}
  sx={{
    width: "100%",
    borderRadius: 4,
    overflow: "hidden",
    p: 1,
  }}
>
 <DataGrid
  rows={finalFilteredRows}
  columns={columns}
  pageSizeOptions={[10, 20, 50, 100]}
  initialState={{
    pagination: {
      paginationModel,
    },
  }}
  disableRowSelectionOnClick
  autoHeight
  rowHeight={55}
  sx={{
    borderRadius: 3,

    "& .MuiDataGrid-columnHeader": {
      backgroundColor: "#1976d2",
    },

    "& .MuiDataGrid-columnHeaderTitle": {
      color: "#fff",
      fontWeight: "bold",
      fontSize: "15px",
    },

    "& .MuiDataGrid-menuIcon button": {
      color: "#fff",
    },

    "& .MuiDataGrid-sortIcon": {
      color: "#fff",
    },

    "& .MuiDataGrid-iconSeparator": {
      color: "#fff",
    },

    "& .MuiDataGrid-row:nth-of-type(even)": {
      backgroundColor: "#fafafa",
    },

    "& .MuiDataGrid-row:hover": {
      backgroundColor: "#E3F2FD",
    },
  }}
/>
</Paper>
    </motion.div>
  );
};
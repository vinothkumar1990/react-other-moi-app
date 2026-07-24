import React, { useState, useRef, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Atom } from "react-loading-indicators";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/MoiSearchProvider";

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
import { SearchMoiFilter } from "./SearchMoiFilter";

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
  },
);

// -------------------
// MAIN COMPONENT
// -------------------
export const MoiSearchRelo = () => {
  const {
    error,
    isLoading,
    rows,
    finalFilteredRows,
    name,
    nameSearch,
    placeSearch,
    listeningField,
    setStatusFilter,
    setNameSearch,
    setPlaceSearch,
    setListeningField,
    statusFilter,
    columns,
  } = useContext(MoiContext);

  // -------------------
  // Columns
  // -------------------

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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box
        sx={{
          background: "linear-gradient(90deg,#c01515,#42a5f5)",
          color: "#fff",
          p: 3,
          borderRadius: 3,
          mb: 3,
          boxShadow: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" style={{ color: "white", textAlign: "center" }}>
          மொய் பதிவுகளை தேடவும் மற்றும் நிர்வகிக்கவும்.
        </Typography>
      </Box>

      <SearchMoiFilter />
      <Card
        elevation={5}
        sx={{
          borderRadius: 4,
          mb: 3,
          p: 1,
        }}
        style={{ color: "#1976d2", backgroundColor: "#b0d8aa" }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={3}>
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

                  <MenuItem value="Pending">நிலுவையில்</MenuItem>

                  <MenuItem value="Completed">நிறைவு</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Clear Button */}

            <Grid item xs={12} md={2} display="flex" alignItems="center">
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
              backgroundColor: "#f7bfb7",
            },
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: "#f8e6b3",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E3F2FD",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#2094e7",
            },
          }}
        />
      </Paper>
    </motion.div>
  );
};

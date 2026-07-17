import React, { useState, useRef } from "react";
import {
  TextField,
  Paper,
  Typography,
  Button,
  CircularProgress,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";

import Swal from "sweetalert2";

import { income_api } from "../utils/donation-income-api";

// DATE PICKER
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";
import { motion } from "framer-motion";

export const NewDonationIncome = () => {
  const username = JSON.parse(localStorage.getItem("loggedInUser"));

  const [newProduct, setNewProduct] = useState({
    place: "",
    name: "",
    amount: "",
    type: "",
    description: "",
    date: null,
    created_by: username?.name || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [listeningField, setListeningField] = useState(null);

  const recognitionRef = useRef(null);

  // 🎤 START VOICE
  const startListening = (field) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      Swal.fire("Error", "Speech Recognition not supported", "error");
      return;
    }

    // stop old voice
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "ta-IN";
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    setListeningField(field);

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      setNewProduct((prev) => ({
        ...prev,
        [field]: text,
      }));
    };

    recognition.onend = () => {
      setListeningField(null);
      recognitionRef.current = null;
    };

    recognition.onerror = () => {
      setListeningField(null);

      Swal.fire("Error", "Voice failed", "error");
    };
  };

  // 🛑 STOP VOICE
  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setListeningField(null);
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    stopVoice();

    const { name, value } = e.target;

    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // VALIDATION
  const validate = () => {
    let temp = {};
    if (!newProduct.place.trim()) {
      temp.place = "ஊர் தேவை";
    }

    if (!newProduct.name.trim()) {
      temp.name = "பெயர் தேவை";
    }

    if (!newProduct.type) {
      temp.type = "வரவு வகை தேர்வு செய்யவும்";
    }

    if (!newProduct.amount) {
      temp.amount = "வரவு தொகை தேவை";
    } else if (isNaN(newProduct.amount)) {
      temp.amount = "எண் மட்டும் உள்ளிடவும்";
    } else if (Number(newProduct.amount) <= 0) {
      temp.amount = "சரியான தொகை கொடுக்கவும்";
    }

    if (!newProduct.date) {
      temp.date = "தேதி தேர்வு செய்யவும்";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  // SUBMIT
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      // SEND FORM DATA
      const payload = {
        ...newProduct,
        date: dayjs(newProduct.date).format("YYYY-MM-DD"),
      };

      await income_api.post("/donation_income", payload);

      Swal.fire({
        icon: "success",
        title: "வெற்றிகரமாக சேமிக்கப்பட்டது",
        timer: 1500,
        showConfirmButton: false,
      });

      setNewProduct({
        name: "",
        place: "",
        amount: "",
        type: "",
        description: "",
        date: null,
        created_by: username?.name || "",
      });

      setErrors({});
    } catch (error) {
      Swal.fire("Error!", "Failed to create record.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        elevation={10}
        sx={{
          maxWidth: 500,
          width: "95%",
          mx: "auto",
          mt: 3,
          p: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          gutterBottom
          color="primary"
        >
          புதிய வரவு
        </Typography>

        <Box
          component="form"
          onSubmit={handleAdd}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* place */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
            }}
          >
            <TextField
              name="place"
              value={newProduct.place}
              label="ஊர்"
              fullWidth
              onChange={handleChange}
              onFocus={stopVoice}
              error={!!errors.place}
              helperText={errors.place}
            />

            <IconButton
              onClick={() => startListening("place")}
              sx={{
                minWidth: 50,
                height: { xs: 45, sm: 56 },
                border: "1px solid #ccc",
                borderRadius: 1,
                alignSelf: { xs: "flex-end", sm: "center" },
              }}
            >
              {listeningField === "place" ? (
                <CircularProgress size={20} />
              ) : (
                <MicIcon
                  color={listeningField === "name" ? "error" : "primary"}
                />
              )}
            </IconButton>
          </Box>

          {/* NAME */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
            }}
          >
            <TextField
              name="name"
              value={newProduct.name}
              label="பெயர்"
              fullWidth
              onChange={handleChange}
              onFocus={stopVoice}
              error={!!errors.name}
              helperText={errors.name}
            />

            <IconButton
              onClick={() => startListening("name")}
              sx={{
                minWidth: 50,
                height: { xs: 45, sm: 56 },
                border: "1px solid #ccc",
                borderRadius: 1,
                alignSelf: { xs: "flex-end", sm: "center" },
              }}
            >
              {listeningField === "name" ? (
                <CircularProgress size={20} />
              ) : (
                <MicIcon
                  color={listeningField === "name" ? "error" : "primary"}
                />
              )}
            </IconButton>
          </Box>

          {/* AMOUNT */}
          <TextField
            name="amount"
            value={newProduct.amount}
            label="வரவு தொகை"
            type="number"
            fullWidth
            onChange={handleChange}
            onFocus={stopVoice}
            error={!!errors.amount}
            helperText={errors.amount}
          />

          {/* DATE PICKER */}
          <DatePicker
            label="தேதி"
            value={newProduct.date}
            onChange={(newValue) => {
              setNewProduct((prev) => ({
                ...prev,
                date: newValue,
              }));
            }}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.date,
                helperText: errors.date,
              },
            }}
          />

          {/* TYPE */}
          <TextField
            select
            name="type"
            value={newProduct.type}
            label="வரவு வகை"
            fullWidth
            onChange={handleChange}
            error={!!errors.type}
            helperText={errors.type}
          >
            <MenuItem value="">-- Select Type --</MenuItem>

            <MenuItem value="நன்கொடை">நன்கொடை வரவு</MenuItem>

            <MenuItem value="பொது">பொது வரவு</MenuItem>

            <MenuItem value="-">-</MenuItem>
          </TextField>

          {/* DESCRIPTION */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
            }}
          >
            <TextField
              name="description"
              value={newProduct.description}
              label="வரவு விளக்கம்"
              multiline
              rows={3}
              fullWidth
              onChange={handleChange}
              onFocus={stopVoice}
            />

            <IconButton
              onClick={() => startListening("description")}
              sx={{
                minWidth: 50,
                height: { xs: 45, sm: 56 },
                border: "1px solid #ccc",
                borderRadius: 1,
                alignSelf: { xs: "flex-end", sm: "center" },
              }}
            >
              {listeningField === "description" ? (
                <CircularProgress size={20} />
              ) : (
                <MicIcon
                  color={listeningField === "description" ? "error" : "primary"}
                />
              )}
            </IconButton>
          </Box>

          {/* USER */}
          <TextField value={username?.name || ""} fullWidth disabled />

          {/* SUBMIT */}
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={22} /> : "Add"}
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

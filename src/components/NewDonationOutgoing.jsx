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
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { outgoing_api } from "../utils/outgoing-api";

// DATE PICKER
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const NewDonationOutgoing = () => {
  const username = JSON.parse(localStorage.getItem("loggedInUser"));

  const [newProduct, setNewProduct] = useState({
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

  // 🎤 VOICE
  const startListening = (field) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      Swal.fire("Error", "Speech not supported", "error");
      return;
    }

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
      let text = event.results[0][0].transcript;

      // amount → numbers only
      if (field === "amount") {
        text = text.replace(/[^0-9]/g, "");
      }

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

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // VALIDATION
  const validate = () => {
    let temp = {};

    if (!newProduct.name.trim()) {
      temp.name = "செலவு தலைப்பு அவசியம்";
    }

    if (!newProduct.amount) {
      temp.amount = "தொகை அவசியம்";
    } else if (isNaN(newProduct.amount)) {
      temp.amount = "எண் மட்டும் உள்ளிடவும்";
    } else if (Number(newProduct.amount) <= 0) {
      temp.amount = "சரியான தொகை உள்ளிடவும்";
    }

    if (!newProduct.type.trim()) {
      temp.type = "வகை தேர்வு செய்யவும்";
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

      await outgoing_api.post("/donation_outgoing", {
        ...newProduct,

        // ✅ convert date
        date: newProduct.date.format("YYYY-MM-DD"),

        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
      });

      Swal.fire({
        icon: "success",
        title: "வெற்றிகரமாக சேமிக்கப்பட்டது",
        timer: 1500,
        showConfirmButton: false,
      });

      // RESET
      setNewProduct({
        name: "",
        amount: "",
        type: "",
        description: "",
        date: null,
        created_by: username?.name || "",
      });

      setErrors({});
    } catch (error) {
      console.log(error);

      Swal.fire("Error!", "சேமிக்க முடியவில்லை", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #aec5f8, #d5f5f1, #ffffff)",
          backgroundSize: "400% 400%",
          animation: "gradient 10s ease infinite",
          p: 2,

          "@keyframes gradient": {
            "0%": {
              backgroundPosition: "0% 50%",
            },
            "50%": {
              backgroundPosition: "100% 50%",
            },
            "100%": {
              backgroundPosition: "0% 50%",
            },
          },
        }}
      >
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          elevation={12}
          sx={{
            maxWidth: 500,
            width: "95%",
            margin: "20px auto",
            p: 3,
            borderRadius: 5,
            backgroundColor: "#f3e4bb",
            boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            color="primary"
            gutterBottom
          >
            புதிய செலவு
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
                label="செலவு தலைப்பு"
                fullWidth
                onChange={handleChange}
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
                  <MicIcon color="primary" />
                )}
              </IconButton>
            </Box>

            {/* AMOUNT */}
            <TextField
              name="amount"
              value={newProduct.amount}
              label="செலவு தொகை"
              type="number"
              fullWidth
              onChange={handleChange}
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
              label="செலவு வகை"
              fullWidth
              onChange={handleChange}
              error={!!errors.type}
              helperText={errors.type}
            >
              <MenuItem value="">-- Select Type --</MenuItem>

              <MenuItem value="நன்கொடை">நன்கொடை செலவு</MenuItem>

              <MenuItem value="பொது">பொது செலவு</MenuItem>

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
                label="செலவு விளக்கம்"
                multiline
                rows={3}
                fullWidth
                onChange={handleChange}
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
                  <MicIcon color="primary" />
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
      </Box>
    </LocalizationProvider>
  );
};

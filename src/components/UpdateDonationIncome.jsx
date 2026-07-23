import React, { useEffect, useState, useRef } from "react";

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

import { useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2";

import { income_api } from "../utils/income-api";

// DATE PICKER
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";
import { motion } from "framer-motion";
export const UpdateDonationIncome = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const username = JSON.parse(localStorage.getItem("loggedInUser"));

  const [updateProduct, setUpdateProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({});

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

      // amount only number
      if (field === "amount") {
        text = text.replace(/[^0-9]/g, "");
      }

      setUpdateProduct((prev) => ({
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

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await income_api.get(
          `/donation_income?select=*&id=eq.${id}`,
        );

        const data = res.data[0];

        setUpdateProduct({
          ...data,

          // convert date to dayjs
          date: data?.date ? dayjs(data.date) : null,
        });
      } catch (error) {
        console.log(error);

        Swal.fire("Error!", "Fetch failed", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdateProduct((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear error
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // VALIDATION
  const validate = () => {
    let temp = {};
    if (!updateProduct.place.trim()) {
      temp.place = "ஊர் தேவை";
    }

    if (!updateProduct.name.trim()) {
      temp.name = "பெயர் தேவை";
    }

    if (!updateProduct.type) {
      temp.type = "வரவு வகை தேர்வு செய்யவும்";
    }

    if (!updateProduct.amount) {
      temp.amount = "வரவு தொகை தேவை";
    } else if (isNaN(updateProduct.amount)) {
      temp.amount = "எண் மட்டும் உள்ளிடவும்";
    } else if (Number(updateProduct.amount) <= 0) {
      temp.amount = "சரியான தொகை கொடுக்கவும்";
    }

    if (!updateProduct.date) {
      temp.date = "தேதி தேர்வு செய்யவும்";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);

      await income_api.patch(`/donation_income?id=eq.${id}`, {
        ...updateProduct,

        name: updateProduct.name.trim(),

        description: updateProduct.description?.trim() || "",

        amount: Number(updateProduct.amount),

        // convert date
        date: updateProduct.date.format("YYYY-MM-DD"),

        created_by: username?.name || "",
      });

      await Swal.fire("Success!", "வெற்றிகரமாக புதுப்பிக்கப்பட்டது", "success");

      navigate("/donation/incomes");
    } catch (error) {
      console.log(error);

      Swal.fire("Error!", "Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  // NO DATA
  if (!updateProduct) {
    return <div>No data</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f8eebf, #f8eebf, #f8eebf)",
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
            backgroundColor: "#d5f5f1",
            boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            color="primary"
            gutterBottom
          >
            வரவு திருத்தம்
          </Typography>

          <Box
            component="form"
            onSubmit={handleUpdate}
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
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 1,
              }}
            >
              <TextField
                name="place"
                value={updateProduct.place || ""}
                label="ஊர்"
                fullWidth
                onChange={handleChange}
                error={!!errors.place}
                helperText={errors.place}
              />

              <IconButton
                onClick={() => startListening("place")}
                sx={{
                  minWidth: 50,
                  height: {
                    xs: 45,
                    sm: 56,
                  },
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  alignSelf: {
                    xs: "flex-end",
                    sm: "center",
                  },
                }}
              >
                {listeningField === "place" ? (
                  <CircularProgress size={20} />
                ) : (
                  <MicIcon color="primary" />
                )}
              </IconButton>
            </Box>

            {/* NAME */}
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 1,
              }}
            >
              <TextField
                name="name"
                value={updateProduct.name || ""}
                label="பெயர்"
                fullWidth
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />

              <IconButton
                onClick={() => startListening("name")}
                sx={{
                  minWidth: 50,
                  height: {
                    xs: 45,
                    sm: 56,
                  },
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  alignSelf: {
                    xs: "flex-end",
                    sm: "center",
                  },
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
              value={updateProduct.amount || ""}
              label="வரவு தொகை"
              type="number"
              fullWidth
              onChange={handleChange}
              error={!!errors.amount}
              helperText={errors.amount}
            />
            {/* DATE */}
            <DatePicker
              label="தேதி"
              value={updateProduct.date}
              onChange={(newValue) => {
                setUpdateProduct((prev) => ({
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
              value={updateProduct.type || ""}
              label="வரவு வகை"
              fullWidth
              onChange={handleChange}
              error={!!errors.type}
              helperText={errors.type}
            >
              <MenuItem value="">-- Select --</MenuItem>

              <MenuItem value="நன்கொடை">நன்கொடை வரவு</MenuItem>

              <MenuItem value="பொது">பொது வரவு</MenuItem>

              <MenuItem value="-">-</MenuItem>
            </TextField>

            {/* DESCRIPTION */}
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 1,
              }}
            >
              <TextField
                name="description"
                value={updateProduct.description || ""}
                label="வரவு விளக்கம்"
                multiline
                rows={3}
                fullWidth
                onChange={handleChange}
              />

              <IconButton
                onClick={() => startListening("description")}
                sx={{
                  minWidth: 50,
                  height: {
                    xs: 45,
                    sm: 56,
                  },
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  alignSelf: {
                    xs: "flex-end",
                    sm: "center",
                  },
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

            {/* BUTTON */}
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={saving}
            >
              {saving ? <CircularProgress size={20} /> : "Update"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

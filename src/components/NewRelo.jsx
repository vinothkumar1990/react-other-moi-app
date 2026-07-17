import React, { useState, useRef, useCallback, memo } from "react";
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EventIcon from "@mui/icons-material/Event";
import SaveIcon from "@mui/icons-material/Save";

// ✅ Supabase
const SUPABASE_URL = "https://ievyooeawrzhkemxfswj.supabase.co/rest/v1/mois";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI";

// ✅ Input Component
const InputWithMic = memo(
  ({
    field,
    label,
    type,
    value,
    onChange,
    onFocus,
    MicInside,
    error,
    helperText,
  }) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          label={label}
          type={type}
          fullWidth
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          autoComplete="off"
          size="small"
          error={error}
          helperText={helperText}
        />
        <MicInside field={field} />
      </Box>
    );
  },
);

export const NewRelo = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  const [newProduct, setNewProduct] = useState({
    name: "",
    place: "",
    old_amount: "",
    new_amount: "",
    given_amount_status: "",
    function_name: loggedInUser?.function_name || "",
    status: "Pending",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [listeningField, setListeningField] = useState(null);
  const recognitionRef = useRef(null);

  // 🎤 Voice
  const startVoice = useCallback((field) => {
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
      let text = event.results[0][0].transcript;

      setNewProduct((prev) => {
        let updated =
          field === "old_amount" || field === "new_amount"
            ? text.replace(/[^0-9]/g, "")
            : prev[field]
              ? prev[field] + " " + text
              : text;

        return { ...prev, [field]: updated };
      });
    };

    recognition.onend = () => setListeningField(null);
  }, []);

  const stopVoice = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListeningField(null);
  }, []);

  const MicInside = ({ field }) => (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        startVoice(field);
      }}
      size="small"
      sx={{
        background: "linear-gradient(45deg,#2196F3,#42A5F5)",
        color: "#fff",
        borderRadius: "50%",
        width: 45,
        height: 45,

        "&:hover": {
          background: "linear-gradient(45deg,#1976D2,#1565C0)",
        },
      }}
      component={motion.button}
      whileHover={{
        scale: 1.2,
        rotate: 10,
      }}
      whileTap={{
        scale: 0.9,
      }}
    >
      <motion.div
        animate={{
          scale: listeningField === field ? [1, 1.3, 1] : 1,
        }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <MicIcon
          fontSize="small"
          color={listeningField === field ? "error" : "primary"}
        />
      </motion.div>
    </IconButton>
  );

  const handleChange = useCallback(
    (field) => (e) => {
      stopVoice();
      setNewProduct((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    },
    [stopVoice],
  );

  // ✅ VALIDATION
  const validate = () => {
    let temp = {};

    if (!newProduct.name.trim()) temp.name = "பெயர் தேவை";
    if (!newProduct.place.trim()) temp.place = "ஊர் தேவை";

    if (!newProduct.old_amount) temp.old_amount = "பழைய பணம் தேவை";
    else if (isNaN(newProduct.old_amount) || Number(newProduct.old_amount) <= 0)
      temp.old_amount = "சரியான தொகை உள்ளிடவும்";

    if (!newProduct.new_amount) temp.new_amount = "புதிய பணம் தேவை";
    else if (isNaN(newProduct.new_amount) || Number(newProduct.new_amount) <= 0)
      temp.new_amount = "சரியான தொகை உள்ளிடவும்";

    if (!newProduct.given_amount_status)
      temp.given_amount_status = "தடவை தேர்வு செய்யவும்";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ✅ SUBMIT
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(SUPABASE_URL, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error(await res.text());

      Swal.fire({
        icon: "success",

        title: "🎉 பதிவு வெற்றிகரமாக சேர்க்கப்பட்டது",

        text: "மொய் தகவல் சேமிக்கப்பட்டது.",

        showConfirmButton: false,

        timer: 1800,

        background: "#E8F5E9",

        color: "#2E7D32",
      });

      setNewProduct({
        name: "",
        place: "",
        old_amount: "",
        new_amount: "",
        given_amount_status: "",
        function_name: loggedInUser?.function_name || "",
        status: "Pending",
      });

      setErrors({});
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #b1ece4, #d5f5f1, #ffffff)",
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
          backgroundColor: "#f5ddeb",
          boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          component={motion.h2}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          align="center"
          sx={{
            fontWeight: "bold",
            fontSize: 28,
            color: "#1565C0",
            mb: 3,
          }}
        >
          புதிய மொய் பதிவு
        </Typography>

        <Grid
          component="form"
          onSubmit={handleAdd}
          sx={{ display: "grid", gap: 2, mt: 2 }}
        >
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
          >
            <InputWithMic
              field="name"
              label="பெயர்"
              value={newProduct.name}
              onFocus={stopVoice}
              onChange={handleChange("name")}
              MicInside={MicInside}
              error={!!errors.name}
              helperText={errors.name}
              sx={{
                background: "#fff",
                borderRadius: 2,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },

                "& .Mui-focused fieldset": {
                  borderColor: "#1976d2",
                  borderWidth: 2,
                },
              }}
            />
          </motion.div>
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
          >
            <InputWithMic
              field="place"
              label="ஊர்"
              value={newProduct.place}
              onFocus={stopVoice}
              onChange={handleChange("place")}
              MicInside={MicInside}
              error={!!errors.place}
              helperText={errors.place}
              sx={{
                background: "#fff",
                borderRadius: 2,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },

                "& .Mui-focused fieldset": {
                  borderColor: "#1976d2",
                  borderWidth: 2,
                },
              }}
            />
          </motion.div>
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
          >
            <InputWithMic
              field="old_amount"
              label="பழைய பணம்"
              type="number"
              value={newProduct.old_amount}
              onFocus={stopVoice}
              onChange={handleChange("old_amount")}
              MicInside={MicInside}
              error={!!errors.old_amount}
              helperText={errors.old_amount}
              sx={{
                background: "#fff",
                borderRadius: 2,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },

                "& .Mui-focused fieldset": {
                  borderColor: "#1976d2",
                  borderWidth: 2,
                },
              }}
            />
          </motion.div>
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
          >
            <InputWithMic
              field="new_amount"
              label="புதிய பணம்"
              type="number"
              value={newProduct.new_amount}
              onFocus={stopVoice}
              onChange={handleChange("new_amount")}
              MicInside={MicInside}
              error={!!errors.new_amount}
              helperText={errors.new_amount}
              sx={{
                background: "#fff",
                borderRadius: 2,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },

                "& .Mui-focused fieldset": {
                  borderColor: "#1976d2",
                  borderWidth: 2,
                },
              }}
            />
          </motion.div>
          <TextField
            select
            label="தடவை"
            value={newProduct.given_amount_status}
            onChange={handleChange("given_amount_status")}
            error={!!errors.given_amount_status}
            helperText={errors.given_amount_status}
            fullWidth
            size="small"
          >
            <MenuItem value="">-- தேர்வு --</MenuItem>
            <MenuItem value="0">0</MenuItem>
            <MenuItem value="I">I</MenuItem>
            <MenuItem value="II">II</MenuItem>
            <MenuItem value="III">III</MenuItem>
            <MenuItem value="IV">IV</MenuItem>
          </TextField>

          <TextField
            label="விழா"
            value={newProduct.function_name}
            fullWidth
            size="small"
            disabled
          />

          <Button
            component={motion.button}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: 18,
              fontWeight: "bold",
              borderRadius: 3,

              background: "linear-gradient(90deg,#4CAF50,#66BB6A)",

              boxShadow: "0 8px 20px rgba(76,175,80,.4)",

              "&:hover": {
                background: "linear-gradient(90deg,#43A047,#2E7D32)",
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={22}
                sx={{
                  color: "#f0dddd",
                }}
              />
            ) : (
              "➕ Add Record"
            )}
          </Button>
        </Grid>
      </Paper>
    </Box>
  );
};

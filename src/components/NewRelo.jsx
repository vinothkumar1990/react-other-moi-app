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

// ✅ Supabase
const SUPABASE_URL = "https://ievyooeawrzhkemxfswj.supabase.co/rest/v1/mois";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI";

// ✅ Input Component
const InputWithMic = memo(
  ({ field, label, type, value, onChange, onFocus, MicInside, error, helperText }) => {
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
  }
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
        border: "1px solid #ccc",
        borderRadius: "8px",
        height: "40px",
        width: "40px",
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
    [stopVoice]
  );

  // ✅ VALIDATION
  const validate = () => {
    let temp = {};

    if (!newProduct.name.trim()) temp.name = "பெயர் தேவை";
    if (!newProduct.place.trim()) temp.place = "ஊர் தேவை";

    if (!newProduct.old_amount)
      temp.old_amount = "பழைய பணம் தேவை";
    else if (isNaN(newProduct.old_amount) || Number(newProduct.old_amount) <= 0)
      temp.old_amount = "சரியான தொகை உள்ளிடவும்";

    if (!newProduct.new_amount)
      temp.new_amount = "புதிய பணம் தேவை";
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

      Swal.fire("Success", "Added successfully", "success");

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
    <Paper
      elevation={10}
      sx={{ maxWidth: 420, width: "95%", margin: "20px auto", p: 2 }}
    >
      <Typography variant="h6" textAlign="center">
        புதிய மொய்
      </Typography>

      <Grid component="form" onSubmit={handleAdd} sx={{ display: "grid", gap: 2, mt: 2 }}>
        
        <InputWithMic
          field="name"
          label="பெயர்"
          value={newProduct.name}
          onFocus={stopVoice}
          onChange={handleChange("name")}
          MicInside={MicInside}
          error={!!errors.name}
          helperText={errors.name}
        />

        <InputWithMic
          field="place"
          label="ஊர்"
          value={newProduct.place}
          onFocus={stopVoice}
          onChange={handleChange("place")}
          MicInside={MicInside}
          error={!!errors.place}
          helperText={errors.place}
        />

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
        />

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
        />

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

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Add"}
        </Button>
      </Grid>
    </Paper>
  );
};
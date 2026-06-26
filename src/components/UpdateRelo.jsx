import React, { useEffect, useState, useRef, useCallback, memo } from "react";
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
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

// ✅ Input Component
const InputWithMic = memo(
  ({ field, label, type = "text", value, onChange, onFocus, Mic, error, helperText }) => (
    <Box sx={{ display: "flex", alignItems: "stretch", gap: 1 }}>
      <TextField
        fullWidth
        label={label}
        type={type}
        value={value || ""}
        onChange={onChange}
        onFocus={onFocus}
        size="small"
        error={!!error}
        helperText={helperText}
      />
      <Mic field={field} />
    </Box>
  )
);

export const UpdateRelo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [updateProduct, setUpdateProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [listeningField, setListeningField] = useState(null);

  const recognitionRef = useRef(null);

  const API_URL =
    "https://ievyooeawrzhkemxfswj.supabase.co/rest/v1/mois";
  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI";

  // 🎤 Voice
  const startVoice = useCallback((field) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      Swal.fire("Error", "Voice not supported", "error");
      return;
    }

    if (recognitionRef.current) recognitionRef.current.stop();

    const recognition = new SpeechRecognition();
    recognition.lang = "ta-IN";
    recognition.start();

    setListeningField(field);
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let text = event.results[0][0].transcript;

      setUpdateProduct((prev) => {
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
    if (recognitionRef.current) recognitionRef.current.stop();
    setListeningField(null);
  }, []);

  const Mic = ({ field }) => (
    <IconButton
      onClick={() => startVoice(field)}
      size="small"
      sx={{
        border: "1px solid #ccc",
        height: 40,
        width: 40,
      }}
    >
      <motion.div
        animate={{
          scale: listeningField === field ? [1, 1.3, 1] : 1,
        }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <MicIcon color={listeningField === field ? "error" : "primary"} />
      </motion.div>
    </IconButton>
  );

  // ✅ Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}?id=eq.${id}`, {
          headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        setUpdateProduct(res.data[0]);
      } catch {
        Swal.fire("Error", "Fetch failed", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (field) => (e) => {
    stopVoice();
    setUpdateProduct((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // ✅ VALIDATION
  const validate = () => {
    let temp = {};

    if (!updateProduct.name?.trim()) temp.name = "பெயர் தேவை";
    if (!updateProduct.place?.trim()) temp.place = "ஊர் தேவை";

    if (!updateProduct.old_amount)
      temp.old_amount = "பழைய பணம் தேவை";
    else if (isNaN(updateProduct.old_amount))
      temp.old_amount = "எண் மட்டும்";

    if (!updateProduct.new_amount)
      temp.new_amount = "புதிய பணம் தேவை";
    else if (isNaN(updateProduct.new_amount))
      temp.new_amount = "எண் மட்டும்";

    if (!updateProduct.given_amount_status)
      temp.given_amount_status = "தடவை தேர்வு செய்யவும்";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ✅ UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    try {
      await axios.patch(`${API_URL}?id=eq.${id}`, updateProduct, {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
      });

      //await Swal.fire("Success", "Updated successfully", "success");

      //navigate("/all", { replace: true });
      await Swal.fire({
        icon: "success",
        title: "Updated Successfully",
        timer: 1000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/all", { replace: true });
      }, 500);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (!updateProduct) return <div>No data</div>;

  return (
    <Paper sx={{ maxWidth: 420, width: "95%", mx: "auto", mt: 3, p: 2 }}>
      <Typography textAlign="center" variant="h6">
        புதுப்பித்தல் மொய்
      </Typography>

      <Box
        component="form"
        onSubmit={handleUpdate}
        sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <InputWithMic
          field="place"
          label="ஊர்"
          value={updateProduct.place}
          onFocus={stopVoice}
          onChange={handleChange("place")}
          Mic={Mic}
          error={errors.place}
          helperText={errors.place}
        />

        <InputWithMic
          field="name"
          label="பெயர்"
          value={updateProduct.name}
          onFocus={stopVoice}
          onChange={handleChange("name")}
          Mic={Mic}
          error={errors.name}
          helperText={errors.name}
        />

        <InputWithMic
          field="old_amount"
          label="பழைய பணம்"
          type="number"
          value={updateProduct.old_amount}
          onFocus={stopVoice}
          onChange={handleChange("old_amount")}
          Mic={Mic}
          error={errors.old_amount}
          helperText={errors.old_amount}
        />

        <InputWithMic
          field="new_amount"
          label="புதிய பணம்"
          type="number"
          value={updateProduct.new_amount}
          onFocus={stopVoice}
          onChange={handleChange("new_amount")}
          Mic={Mic}
          error={errors.new_amount}
          helperText={errors.new_amount}
        />

        <TextField
          select
          label="தடவை"
          value={updateProduct.given_amount_status || ""}
          onChange={handleChange("given_amount_status")}
          error={!!errors.given_amount_status}
          helperText={errors.given_amount_status}
        >
          <MenuItem value="">-- தேர்வு --</MenuItem>
          <MenuItem value="0">0</MenuItem>
          <MenuItem value="I">I</MenuItem>
          <MenuItem value="II">II</MenuItem>
          <MenuItem value="III">III</MenuItem>
          <MenuItem value="IV">IV</MenuItem>
        </TextField>

        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? <CircularProgress size={20} /> : "Update"}
        </Button>
      </Box>
    </Paper>
  );
};
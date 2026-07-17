import { createContext, useState, useRef, useCallback, memo } from "react";
import MicIcon from "@mui/icons-material/Mic";
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
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EventIcon from "@mui/icons-material/Event";
import SaveIcon from "@mui/icons-material/Save";
export const MoiContext = createContext();

export const MoiProvider = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const SUPABASE_URL = "https://ievyooeawrzhkemxfswj.supabase.co/rest/v1/mois";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI";

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

  return (
    <MoiContext.Provider
      value={{
        newProduct,
        setNewProduct,
        errors,
        setErrors,
        loading,
        setLoading,
        listeningField,
        recognitionRef,
        startVoice,
        stopVoice,
        MicInside,
        handleChange,
        handleAdd,
        InputWithMic,
        validate,
        loggedInUser,
      }}
    >
      {children}
    </MoiContext.Provider>
  );
};

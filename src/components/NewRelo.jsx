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
import { useContext } from "react";
import { MoiContext } from "../context/MoiProvider";
import { NewMoiForm } from "./NewMoiForm";

// ✅ Supabase

export const NewRelo = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const {
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
  } = useContext(MoiContext);

  // ✅ SUBMIT

  return <NewMoiForm />;
};

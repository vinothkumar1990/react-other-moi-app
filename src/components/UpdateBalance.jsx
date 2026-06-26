// src/components/UpdateBalance.jsx
import React, { useEffect, useState } from "react";
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Box
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { balance_api } from "../utils/balance-api";

export const UpdateBalance = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [updateProduct, setUpdateProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // 📥 FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await balance_api.get(`/balance?select=*&id=eq.${id}`);
        setUpdateProduct(res.data[0]);
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Fetch failed", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✏️ HANDLE CHANGE (WITH LIVE ERROR CLEAR)
  const handleChange = (e) => {
    let { name, value } = e.target;

    // ✅ YEAR மட்டும் number allow
    if (name === "year") {
      value = value.replace(/[^0-9]/g, "");
    }

    // ✅ AMOUNT clean (no negative symbols)
    if (name === "balance_amount") {
      value = value.replace(/[^0-9.]/g, "");
    }

    setUpdateProduct((prev) => ({
      ...prev,
      [name]: value
    }));

    // ✅ remove error instantly
    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  // ✅ VALIDATION
  const validate = () => {
    let temp = {};

    // YEAR
    if (!updateProduct.year || updateProduct.year.trim() === "") {
      temp.year = "ஆண்டு அவசியம்";
    } else if (!/^\d{4}$/.test(updateProduct.year)) {
      temp.year = "4 இலக்க ஆண்டு மட்டும்";
    } else if (
      Number(updateProduct.year) < 1900 ||
      Number(updateProduct.year) > 2100
    ) {
      temp.year = "சரியான ஆண்டு இல்லை";
    }

    // AMOUNT
    if (
      updateProduct.balance_amount === "" ||
      updateProduct.balance_amount === null
    ) {
      temp.balance_amount = "தொகை அவசியம்";
    } else if (isNaN(updateProduct.balance_amount)) {
      temp.balance_amount = "எண் மட்டும் உள்ளிடவும்";
    } else if (Number(updateProduct.balance_amount) <= 0) {
      temp.balance_amount = "0 விட அதிகமாக இருக்க வேண்டும்";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // 💾 UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);

      await balance_api.patch(`/balance?id=eq.${id}`, {
        ...updateProduct,
        year: Number(updateProduct.year),
        balance_amount: Number(updateProduct.balance_amount)
      });

      await Swal.fire("Success!", "வெற்றிகரமாக புதுப்பிக்கப்பட்டது", "success");

      navigate("/kovil/balances");

    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (!updateProduct) {
    return (
      <Box textAlign="center" mt={5}>
        No data found
      </Box>
    );
  }

  return (
    <Paper
      elevation={20}
      sx={{
        maxWidth: 400,
        width: "95%",
        mx: "auto",
        mt: 3,
        p: 3
      }}
    >
      <Typography variant="h5" textAlign="center" color="primary" gutterBottom>
        மீதம் திருத்தம்
      </Typography>

      <Grid
        component="form"
        onSubmit={handleUpdate}
        sx={{ display: "grid", gap: 2 }}
      >
        {/* YEAR */}
        <TextField
          name="year"
          value={updateProduct.year || ""}
          label="ஆண்டு"
          fullWidth
          onChange={handleChange}
          error={!!errors.year}
          helperText={errors.year}
          inputProps={{ maxLength: 4 }}
        />

        {/* AMOUNT */}
        <TextField
          name="balance_amount"
          value={updateProduct.balance_amount || ""}
          label="மீத தொகை"
          type="number"
          fullWidth
          onChange={handleChange}
          error={!!errors.balance_amount}
          helperText={errors.balance_amount}
        />

        {/* BUTTON */}
        <Button
          type="submit"
          variant="contained"
          color="success"
          disabled={saving}
        >
          {saving ? <CircularProgress size={24} color="inherit" /> : "Save"}
        </Button>
      </Grid>
    </Paper>
  );
};
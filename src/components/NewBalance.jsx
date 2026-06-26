import React, { useState } from "react";
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Box
} from "@mui/material";
import Swal from "sweetalert2";
import { balance_api } from "../utils/balance-api";

export const NewBalance = () => {
  const currentYear = new Date().getFullYear();

  const [newProduct, setNewProduct] = useState({
    year: "",
    balance_amount: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ VALIDATION
  const validate = () => {
    let temp = {};

    // Year validation
    if (!newProduct.year) {
      temp.year = "ஆண்டு அவசியம்";
    } else if (!/^\d{4}$/.test(newProduct.year)) {
      temp.year = "4 இலக்க ஆண்டு மட்டும்";
    } else if (
      Number(newProduct.year) < 1900 ||
      Number(newProduct.year) > currentYear + 1
    ) {
      temp.year = `1900 முதல் ${currentYear + 1} வரை மட்டும்`;
    }

    // Amount validation
    if (!newProduct.balance_amount) {
      temp.balance_amount = "மீத தொகை அவசியம்";
    } else if (isNaN(newProduct.balance_amount)) {
      temp.balance_amount = "எண் மட்டும் உள்ளிடவும்";
    } else if (Number(newProduct.balance_amount) <= 0) {
      temp.balance_amount = "0 விட பெரிய தொகை இருக்க வேண்டும்";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🔥 Allow only numbers for year
    if (name === "year" && !/^\d*$/.test(value)) return;

    setNewProduct((prev) => ({
      ...prev,
      [name]: value
    }));

    // ✅ clear error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  // ✅ SUBMIT
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await balance_api.post("/balance", {
        ...newProduct,
        year: newProduct.year.trim(),
        balance_amount: Number(newProduct.balance_amount),
      });

      Swal.fire({
        icon: "success",
        title: "வெற்றிகரமாக சேமிக்கப்பட்டது",
        timer: 1500,
        showConfirmButton: false
      });

      // reset
      setNewProduct({
        year: "",
        balance_amount: "",
      });

      setErrors({});
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "சேமிக்க முடியவில்லை", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={10}
      sx={{
        maxWidth: 450,
        width: "95%",
        mx: "auto",
        mt: 3,
        p: { xs: 2, sm: 3 }
      }}
    >
      <Typography
        variant="h5"
        textAlign="center"
        gutterBottom
        color="primary"
      >
        புதிய மீதம்
      </Typography>

      <Box
        component="form"
        onSubmit={handleAdd}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}
      >
        {/* YEAR */}
        <TextField
          name="year"
          value={newProduct.year}
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
          value={newProduct.balance_amount}
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
          fullWidth
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Add"
          )}
        </Button>
      </Box>
    </Paper>
  );
};
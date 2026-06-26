import React, { useState, useEffect } from "react";
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  MenuItem
} from "@mui/material";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

export const NewLoan = () => {
  

  const paperStyle = {
    width: 400,
    margin: "20px auto",
    padding: "20px",
  };

  const [newProduct, setNewProduct] = useState({
    name: "",
    place: "",
    old_amount: "",
    new_amount: "",
    given_amount_status: "",
    function_name: "",
    status: "Pending",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Supabase Config
  const API_URL = "https://ievyooeawrzhkemxfswj.supabase.co/rest/v1/loans";
  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI";

  

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // ✅ Validation
  const validate = () => {
    let tempErrors = {};

    if (!newProduct.name.trim()) tempErrors.name = "Name is required";
    if (!newProduct.place.trim()) tempErrors.place = "Place is required";

    if (newProduct.old_amount === "")
      tempErrors.old_amount = "Old Amount is required";
    else if (isNaN(newProduct.old_amount))
      tempErrors.old_amount = "Old Amount must be a number";

    if (newProduct.new_amount === "")
      tempErrors.new_amount = "New Amount is required";
    else if (isNaN(newProduct.new_amount))
      tempErrors.new_amount = "New Amount must be a number";

    if (!newProduct.given_amount_status.trim())
      tempErrors.given_amount_status = "Moi status is required";

    if (!newProduct.given_amount_status.trim())
      tempErrors.given_amount_status = "Moi status is required";
    if (!newProduct.function_name.trim())
      tempErrors.function_name = "Function name is required";


    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // ✅ Submit handler
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const payload = {
      ...newProduct,
      old_amount: Number(newProduct.old_amount),
      new_amount: Number(newProduct.new_amount),
    };

    console.log("Submitting payload:", payload); // Debug check

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Supabase Error:", data);
        throw new Error(data.message || "Failed to create record");
      }

      Swal.fire({
        icon: "success",
        title: "Created successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      // ✅ Reset form but keep moi_id
      setNewProduct({
        name: "",
        place: "",
        old_amount: "",
        new_amount: "",
        given_amount_status: "",
        function_name: "",
        status: "Pending",
      });
      setErrors({});
    } catch (error) {
      console.error("Error creating Loan:", error);
      Swal.fire("Error!", error.message || "Failed to create Loan.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={20} style={paperStyle}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        புதிய மொய்
      </Typography>

      <Grid
        component="form"
        style={{ display: "grid", gap: "20px" }}
        onSubmit={handleAdd}
      >
        <TextField
          name="place"
          value={newProduct.place}
          label="ஊர்"
          variant="outlined"
          fullWidth
          required
          onChange={handleChange}
          error={!!errors.place}
          helperText={errors.place}
        />
        <TextField
          name="name"
          value={newProduct.name}
          label="பெயர்"
          variant="outlined"
          fullWidth
          required
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />
        
        <TextField
          name="old_amount"
          value={newProduct.old_amount}
          label="பழைய பணம்"
          variant="outlined"
          fullWidth
          required
          type="number"
          onChange={handleChange}
          error={!!errors.old_amount}
          helperText={errors.old_amount}
        />
        <TextField
          name="new_amount"
          value={newProduct.new_amount}
          label="புதிய பணம்"
          variant="outlined"
          fullWidth
          required
          type="number"
          onChange={handleChange}
          error={!!errors.new_amount}
          helperText={errors.new_amount}
        />
        {/*<TextField
          name="given_amount_status"
          value={newProduct.given_amount_status}
          label="தடவை"
          variant="outlined"
          fullWidth
          required
          onChange={handleChange}
          error={!!errors.given_amount_status}
          helperText={errors.given_amount_status}
        />*/}
        {/* ✅ தடவை Select Dropdown */}
                        <TextField
                          select
                          name="given_amount_status"
                          value={newProduct.given_amount_status}
                          label="தடவை"
                          variant="outlined"
                          fullWidth
                          required
                          onChange={handleChange}
                          error={!!errors.given_amount_status}
                          helperText={errors.given_amount_status}
                        >
                          <MenuItem value="">-- தடவை தேர்ந்தெடுக்கவும் --</MenuItem>
                          <MenuItem value="0">0</MenuItem>
                          <MenuItem value="I">I</MenuItem>
                          <MenuItem value="II">II</MenuItem>
                          <MenuItem value="III">III</MenuItem>
                          <MenuItem value="IV">IV</MenuItem>
                        </TextField>
        <TextField
          name="function_name"
          value={newProduct.function_name}
          label="விழா"
          variant="outlined"
          fullWidth
          required
          onChange={handleChange}
          error={!!errors.function_name}
          helperText={errors.function_name}
        />
        
        <TextField
                    select
                    name="status"
                    value={newProduct.status}
                    label="மொய் நிலை"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange}
                    disabled
                  >
                    <MenuItem value="Pending">நிலுவையில்</MenuItem>
                    <MenuItem value="Completed">முடிக்கப்பட்டது</MenuItem>
                  </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add"}
        </Button>
      </Grid>
    </Paper>
  );
};

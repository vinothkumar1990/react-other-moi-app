import React, { useState } from 'react';
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  MenuItem
} from "@mui/material";
import Swal from 'sweetalert2';

export const NewMoi = () => {
  const paperStyle = {
    width: 400,
    margin: "20px auto",
    padding: "20px"
  };

  const [newProduct, setNewProduct] = useState({
    name: "",
    place: "",
    old_amount: "",
    new_amount: "",
    given_amount_status: "",
    status: "Pending"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Validation function
  const validate = () => {
    let tempErrors = {};

    if (!newProduct.name.trim()) tempErrors.name = "Name is required";
    if (!newProduct.place.trim()) tempErrors.place = "Place is required";

    if (newProduct.old_amount !== "" && isNaN(newProduct.old_amount))
      tempErrors.old_amount = "Old Amount must be a number";
    else if (Number(newProduct.old_amount) < 0)
      tempErrors.old_amount = "Old Amount cannot be negative";

    if (newProduct.new_amount !== "" && isNaN(newProduct.new_amount))
      tempErrors.new_amount = "New Amount must be a number";
    else if (Number(newProduct.new_amount) < 0)
      tempErrors.new_amount = "New Amount cannot be negative";

    if (!newProduct.given_amount_status.trim())
      tempErrors.given_amount_status = "Moi status is required";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submit
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const response = await fetch("https://68e3d31b8e14f4523daec9c5.mockapi.io/api/v1/all_mois", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) throw new Error("Failed to create record");

      Swal.fire({
        icon: "success",
        title: "Created successfully",
        showConfirmButton: false,
        timer: 1500
      });

      // Reset form
      setNewProduct({
        name: "",
        place: "",
        old_amount: "",
        new_amount: "",
        given_amount_status: "",
        status: "Pending"
      });

      setErrors({});
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to create Moi.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={20} style={paperStyle}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Create New Moi
      </Typography>

      <Grid
        component="form"
        style={{ display: "grid", gap: "20px" }}
        onSubmit={handleAdd}
      >
        <TextField
          name="name"
          value={newProduct.name}
          label="Name"
          variant="outlined"
          fullWidth
          required
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          name="place"
          value={newProduct.place}
          label="Place"
          variant="outlined"
          fullWidth
          required
          onChange={handleChange}
          error={!!errors.place}
          helperText={errors.place}
        />
        <TextField
          name="old_amount"
          value={newProduct.old_amount}
          label="Old Amount"
          variant="outlined"
          required
          fullWidth
          type="number"
          onChange={handleChange}
          error={!!errors.old_amount}
          helperText={errors.old_amount}
        />
        <TextField
          name="new_amount"
          value={newProduct.new_amount}
          label="New Amount"
          variant="outlined"
          fullWidth
          required
          type="number"
          onChange={handleChange}
          error={!!errors.new_amount}
          helperText={errors.new_amount}
        />
        <TextField
          name="given_amount_status"
          value={newProduct.given_amount_status}
          label="Moi Status"
          variant="outlined"
          fullWidth
          required
          onChange={handleChange}
          error={!!errors.given_amount_status}
          helperText={errors.given_amount_status}
        />
        <TextField
          name="status"
          value={newProduct.status}
          label="Status"
          variant="outlined"
          fullWidth
          disabled
        />
        {/* Type Dropdown */}
                <TextField
                  select
                  name="function_name"
                  value={newProduct.function_name}
                  label="Function Name"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                >
                  <MenuItem value="">-- Select Function Name --</MenuItem>
                  <MenuItem value="வினோத் திருமணம்">வினோத் திருமணம்</MenuItem>
                  <MenuItem value="விக்னேஷ் திருமணம்">விக்னேஷ் திருமணம்</MenuItem>
                  <MenuItem value="விஜய் திருமணம்">விஜய் திருமணம்</MenuItem>
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

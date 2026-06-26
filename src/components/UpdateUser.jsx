import React, { useEffect, useState } from "react";
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../utils/api";

export const UpdateUser = () => {
  const paperStyle = {
    width: 400,
    margin: "20px auto",
    padding: "20px",
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const [updateProduct, setUpdateProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ FETCH USER
  useEffect(() => {
    api
      .get(`/users?id=eq.${id}`)
      .then((res) => {
        if (res.data.length > 0) {
          setUpdateProduct(res.data[0]); // ✅ important
        } else {
          setUpdateProduct(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error!", "Failed to fetch data.", "error");
        setLoading(false);
      });
  }, [id]);

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ UPDATE USER
  const handleUpdate = (e) => {
    e.preventDefault();
    setSaving(true);

    api
      .patch(`/users?id=eq.${id}`, updateProduct) // ✅ PATCH + filter
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "User updated successfully",
        }).then(() => {
          navigate("/users");
        });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error!", "Update failed.", "error");
      })
      .finally(() => setSaving(false));
  };

  // LOADING
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress color="success" />
      </div>
    );
  }

  // NO DATA
  if (!updateProduct) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        No data found
      </div>
    );
  }

  return (
    <Paper elevation={20} style={paperStyle}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Update User
      </Typography>

      <Grid
        component="form"
        style={{ display: "grid", gap: "20px" }}
        onSubmit={handleUpdate}
      >
        <TextField
          name="name"
          value={updateProduct.name || ""}
          label="Name"
          fullWidth
          onChange={handleChange}
        />

        <TextField
          name="email"
          value={updateProduct.email || ""}
          label="Email"
          fullWidth
          onChange={handleChange}
        />

        <TextField
          name="password"
          value={updateProduct.password || ""}
          label="Password"
          type="password"
          fullWidth
          onChange={handleChange}
        />

        <TextField
          name="function_name"
          value={updateProduct.function_name || ""}
          label="Function Name"
          fullWidth
          onChange={handleChange}
        />

        <select
          name="role"
          value={updateProduct.role || "free"}
          onChange={handleChange}
          style={{ padding: "10px" }}
        >
          <option value="free">Free</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <select
          name="status"
          value={updateProduct.status || "active"}
          onChange={handleChange}
          style={{ padding: "10px" }}
        >
          <option value="active">Active</option>
          <option value="inactive">In Active</option>
          
        </select>

        <Button
          type="submit"
          variant="contained"
          color="success"
          disabled={saving}
        >
          {saving ? "Saving..." : "Update"}
        </Button>
      </Grid>
    </Paper>
  );
};
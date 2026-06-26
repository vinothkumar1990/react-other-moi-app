import React, { useEffect, useState } from "react";
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  MenuItem
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export const UpdateLoan = () => {
  const paperStyle = {
    width: 400,
    margin: "20px auto",
    padding: "20px"
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const [updateProduct, setUpdateProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Supabase Configuration
  const API_URL = "https://ievyooeawrzhkemxfswj.supabase.co/rest/v1/loans";
  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI";

  // ✅ Fetch existing data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}?id=eq.${id}`, {
          headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          }
        });

        if (res.data && res.data.length > 0) {
          setUpdateProduct(res.data[0]); // Get first record
        } else {
          Swal.fire("Not Found", "No record found for this ID.", "warning");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        Swal.fire("Error!", "Failed to fetch data from Supabase.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({ ...updateProduct, [name]: value });
  };

  // ✅ Handle Form Submit (Update Record)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.patch(`${API_URL}?id=eq.${id}`, updateProduct, {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        }
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "The Moi record was updated successfully.",
        confirmButtonColor: "#3085d6"
      }).then(() => navigate("/loans"));
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error!", "Failed to update Moi record.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Loading State
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress color="success" />
      </div>
    );
  }

  // ✅ If no data found
  if (!updateProduct) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        No data found.
      </div>
    );
  }

  return (
    <Paper elevation={20} style={paperStyle}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        புதுப்பித்தல் மொய்
      </Typography>

      <Grid
        component="form"
        style={{ display: "grid", gap: "20px" }}
        onSubmit={handleUpdate}
      >
        <TextField
          name="name"
          value={updateProduct.name || ""}
          label="பெயர்"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          required
        />
        <TextField
          name="place"
          value={updateProduct.place || ""}
          label="ஊர்"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          required
        />
        <TextField
          name="old_amount"
          value={updateProduct.old_amount || "0"}
          label="பழைய பணம்"
          variant="outlined"
          fullWidth
          type="number"
          onChange={handleChange}
        />
        <TextField
          name="new_amount"
          value={updateProduct.new_amount || "0"}
          label="புதிய பணம்"
          variant="outlined"
          fullWidth
          type="number"
          onChange={handleChange}
        />
        {/* தடவை */}
                <TextField
                  select
                  name="given_amount_status"
                  value={updateProduct.given_amount_status || ""}
                  label="தடவை"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={handleChange}
                  
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
                  value={updateProduct.function_name || ""}
                  label="விழா"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                />
        <TextField
                            select
                            name="status"
                            value={updateProduct.status}
                            label="மொய் நிலை"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                          >
                            <MenuItem value="Pending">நிலுவையில்</MenuItem>
                            <MenuItem value="Completed">முடிக்கப்பட்டது</MenuItem>
                          </TextField>
        

        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Grid>
    </Paper>
  );
};

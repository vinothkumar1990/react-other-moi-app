import React, { useEffect, useState } from 'react';
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  MenuItem
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export const UpdateMoi = () => {
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

  // Fetch existing data
  useEffect(() => {
    axios.get(`https://68e3d31b8e14f4523daec9c5.mockapi.io/api/v1/all_mois/${id}`)
      .then(res => {
        setUpdateProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        Swal.fire("Error!", "Failed to fetch data.", "error");
        setLoading(false);
      });
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({ ...updateProduct, [name]: value });
  };

  // Handle form submit
  const handleUpdate = (e) => {
    e.preventDefault();
    setSaving(true);

    axios.put(`https://68e3d31b8e14f4523daec9c5.mockapi.io/api/v1/all_mois/${id}`, updateProduct)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'The Moi was updated successfully.',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          navigate("/users");
        });
      })
      .catch(() => {
        Swal.fire("Error!", "Failed to update Moi.", "error");
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress color="success" />
      </div>
    );
  }

  if (!updateProduct) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>No data found.</div>;
  }

  return (
    <Paper elevation={20} style={paperStyle}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Update Moi
      </Typography>

      <Grid
        component="form"
        style={{ display: "grid", gap: "20px" }}
        onSubmit={handleUpdate}
      >
        <TextField
          name="name"
          value={updateProduct.name || ''}
          label="Name"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          required
        />
        <TextField
          name="place"
          value={updateProduct.place || ''}
          label="Place"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          required
        />
        <TextField
          name="old_amount"
          value={updateProduct.old_amount || '0'}
          label="Old Amount"
          variant="outlined"
          fullWidth
          type="number"
          onChange={handleChange}
        />
        <TextField
          name="new_amount"
          value={updateProduct.new_amount || '0'}
          label="New Amount"
          variant="outlined"
          fullWidth
          type="number"
          onChange={handleChange}
        />
        <TextField
          name="given_amount_status"
          value={updateProduct.given_amount_status || ''}
          label="Given Amount Status"
          variant="outlined"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          name="status"
          value={updateProduct.status || ''}
          label="Status"
          variant="outlined"
          fullWidth
          onChange={handleChange}
        />
        {/* Type Dropdown */}
                        <TextField
                          select
                          name="function_name"
                          value={updateProduct.function_name || ""}
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
          color="success"
          fullWidth
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Grid>
    </Paper>
  );
};

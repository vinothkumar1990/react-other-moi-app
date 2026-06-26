// src/components/ResetPassword.jsx

import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import Swal from "sweetalert2";

const SUPABASE_URL =
  "https://maywdxirobbziiuhjttx.supabase.co/rest/v1/users";

const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA";

function ResetPassword() {
  const [password, setPassword] =
    useState("");

  const email =
    localStorage.getItem("resetEmail");

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}?email=eq.${email}`,
        {
          method: "PATCH",
          headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      if (!response.ok)
        throw new Error(
          "Password update failed"
        );

      Swal.fire(
        "Success",
        "Password Updated",
        "success"
      );

      localStorage.removeItem(
        "resetEmail"
      );

      window.location.href = "/";
    } catch (error) {
      Swal.fire(
        "Error",
        error.message,
        "error"
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 10,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
        >
          Reset Password
        </Typography>

        <TextField
          fullWidth
          type="password"
          label="New Password"
          margin="normal"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleUpdate}
        >
          Update Password
        </Button>
      </Paper>
    </Container>
  );
}

export default ResetPassword;
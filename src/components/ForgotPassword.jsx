// src/components/ForgotPassword.jsx

import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";

const SUPABASE_URL =
  "https://maywdxirobbziiuhjttx.supabase.co/rest/v1/users";

const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Swal.fire(
        "Error",
        "Please enter email",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${SUPABASE_URL}?email=eq.${email}`,
        {
          headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const data = await response.json();

      if (data.length === 0) {
        Swal.fire(
          "Error",
          "Email not found",
          "error"
        );
        return;
      }

      localStorage.setItem(
        "resetEmail",
        email
      );

      Swal.fire(
        "Success",
        "Email verified",
        "success"
      );

      window.location.href =
        "/reset-password";
    } catch (error) {
      Swal.fire(
        "Error",
        error.message,
        "error"
      );
    } finally {
      setLoading(false);
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
          Forgot Password
        </Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress
              size={24}
              color="inherit"
            />
          ) : (
            "Verify Email"
          )}
        </Button>
      </Paper>
    </Container>
  );
}

export default ForgotPassword;
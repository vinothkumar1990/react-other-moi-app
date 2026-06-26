// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginUser } from '../utils/auth';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  CircularProgress,
} from '@mui/material';
import Swal from 'sweetalert2';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  const result = await loginUser(
    email,
    password,
    navigate
  );

  setLoading(false);

  if (result.success) {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: result.message,
    });
  } else {
    setError(result.message);

    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: result.message,
    });
  }
};

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 10 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}

          <Button
  type="submit"
  variant="contained"
  color="primary"
  fullWidth
  sx={{ mt: 2 }}
  disabled={loading}
>
  {loading ? (
    <CircularProgress size={24} color="inherit" />
  ) : (
    "Login"
  )}
</Button>

<Box textAlign="right" mt={1}>
  <Link
    component={RouterLink}
    to="/forgot-password"
    underline="hover"
  >
    Forgot Password?
  </Link>
</Box>
        </Box>

        {<Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don’t have an account?{' '}
          <Link component={RouterLink} to="/signup">
            SignUp
          </Link>
        </Typography>}
      </Paper>
    </Container>
  );
}

// ✅ Make sure to export default!
export default Login;

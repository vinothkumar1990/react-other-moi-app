import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import { motion } from "framer-motion";

function Register() {
  const navigate = useNavigate();

  const API_URL = "https://maywdxirobbziiuhjttx.supabase.co/rest/v1/users";

  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA"; // ⚠️ keep in .env in real project

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "free",
    function_name: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Validation
  const validate = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return false;
    }
    return true;
  };

  // ✅ Register function
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      Swal.fire({
        icon: "success",
        title: "User Registered Successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      // ✅ Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "free",
        function_name: "",
        status: "Pending",
      });

      // ✅ Redirect (optional)
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("Registration failed");
      Swal.fire("Error!", "Failed to register user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="card shadow-lg p-4"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-4">Sign Up</h3>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            className="form-control mb-3"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            className="form-control mb-3"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            className="form-control mb-3"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <select
            name="role"
            className="form-select mb-3"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="free">Free</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="text"
            name="function_name"
            className="form-control mb-3"
            placeholder="Function Name"
            value={formData.function_name}
            onChange={handleChange}
          />

          {error && <div className="alert alert-danger">{error}</div>}

          <motion.button
            whileHover={!loading && { scale: 1.05 }}
            whileTap={!loading && { scale: 0.95 }}
            className="btn btn-dark w-100 d-flex justify-content-center align-items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Register;
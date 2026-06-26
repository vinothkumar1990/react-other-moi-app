import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

function SignUp() {
  const navigate = useNavigate();

  const API_URL = "https://maywdxirobbziiuhjttx.supabase.co/rest/v1/users";
  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "free",
    function_name: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // ✅ Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char";
    }
     // ✅ NEW VALIDATION (function_name)
    if (!formData.function_name.trim()) {
      newErrors.function_name = "Function name is required";
    } else if (formData.function_name.length < 3) {
      newErrors.function_name = "Minimum 3 characters required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Check duplicate email
  const checkEmailExists = async (email) => {
    const res = await fetch(
      `${API_URL}?email=eq.${email}&select=id`,
      {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const data = await res.json();
    return data.length > 0;
  };

  // ✅ Register
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      // 🔥 1. Check duplicate email
      const exists = await checkEmailExists(formData.email);

      if (exists) {
        setErrors({
          ...errors,
          email: "Email already registered",
        });
        setLoading(false);
        return;
      }

      // 🔥 2. Insert user
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Insert failed");

      // 🔥 3. Send email
      await emailjs.send(
        "service_weg5blh",
        "template_2nvcmzb",
        {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          function_name: formData.function_name,
          password: formData.password,
        },
        "XlpzewjfbJtoPKxrw"
      );

      Swal.fire("Success!", "Registered Successfully", "success");

      navigate("/login");

    } catch (err) {
      Swal.fire("Error!", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Animation
  const shake = {
    animate: {
      x: [-5, 5, -5, 5, 0],
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4 shadow"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-4">🚀 Sign Up</h3>

        <form onSubmit={handleRegister}>

          {/* NAME */}
          <motion.div animate={errors.name && "animate"} variants={shake}>
            <input
              type="text"
              name="name"
              className={`form-control mb-2 ${errors.name && "is-invalid"}`}
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <div className="text-danger small">{errors.name}</div>
          </motion.div>

          {/* EMAIL */}
          <motion.div animate={errors.email && "animate"} variants={shake}>
            <input
              type="email"
              name="email"
              className={`form-control mb-2 ${errors.email && "is-invalid"}`}
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <div className="text-danger small">{errors.email}</div>
          </motion.div>

          {/* PASSWORD */}
          <motion.div animate={errors.password && "animate"} variants={shake}>
            <input
              type="password"
              name="password"
              className={`form-control mb-2 ${errors.password && "is-invalid"}`}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <div className="text-danger small">{errors.password}</div>
          </motion.div>

          

          {/* FUNCTION NAME */}
          <motion.div
            animate={errors.function_name && "animate"}
            variants={shake}
          >
            <input
              type="text"
              name="function_name"
              className={`form-control mb-2 ${
                errors.function_name && "is-invalid"
              }`}
              placeholder="Function Name"
              value={formData.function_name}
              onChange={handleChange}
            />
            <div className="text-danger small">
              {errors.function_name}
            </div>
          </motion.div>

          {/* ROLE */}
          <select
            name="role"
            className="form-select mb-3"
            value={formData.role}
            onChange={handleChange}
            disabled={true}
          >
            <option value="free">Free</option>
          </select>

          {/* Status */}
          <select
            name="status"
            className="form-select mb-3"
            value={formData.status}
            onChange={handleChange}
            disabled={true}
          >
            <option value="active">Active</option>
          </select>


          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>

        </form>
      </motion.div>
    </div>
  );
}

export default SignUp;
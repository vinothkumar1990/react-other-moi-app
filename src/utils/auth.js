// src/utils/auth.js
import axios from "axios";

const BASE_URL = "https://maywdxirobbziiuhjttx.supabase.co";
const TABLE = "users";

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA"; // ✅ correct key

// ✅ Axios instance
const api = axios.create({
  baseURL: `${BASE_URL}/rest/v1/${TABLE}`,
  headers: {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
});

// Session expiry (2 hours)
const SESSION_EXPIRY_TIME = 2 * 60 * 60 * 1000;

/**
 * 🔐 LOGIN
 */
export const loginUser = async (email, password, navigate) => {
  try {
    const response = await api.get("", {
      params: {
        email: `eq.${email}`,
        password: `eq.${password}`,
      },
    });

    console.log("API RESPONSE:", response.data);

    if (response.data.length === 0) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    const user = response.data[0];

    // ✅ Check status
    if (user.status?.toLowerCase() !== "active") {
      return {
        success: false,
        message: "Your account is inactive. Please contact admin.",
      };
    }

    // ✅ Login Success
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    localStorage.setItem("loginTime", Date.now());

    window.dispatchEvent(new Event("userChanged"));

    navigate("/");

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

/**
 * ⏳ SESSION VALIDATION
 */
export const isSessionValid = () => {
  const loginTime = localStorage.getItem("loginTime");
  if (!loginTime) return false;

  return Date.now() - loginTime <= SESSION_EXPIRY_TIME;
};

/**
 * 🔒 AUTH CHECK
 */
export const isAuthenticated = () => {
  const user = localStorage.getItem("loggedInUser");
  if (!user) return false;

  if (!isSessionValid()) {
    logoutUser();
    return false;
  }

  return true;
};

/**
 * 🚪 LOGOUT
 */
export const logoutUser = () => {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("loginTime");
  window.dispatchEvent(new Event("userChanged"));
};

/**
 * 🅰️ INITIALS
 */
export const getUserInitials = () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  return user?.name ? user.name.substring(0, 2).toUpperCase() : "";
};

/**
 * 🎭 ROLE
 */
export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  return user?.role || null;
};
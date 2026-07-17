// src/components/Header.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  isAuthenticated,
  logoutUser,
  getUserRole,
  getUserInitials,
} from "../utils/auth";
import { Image } from "react-bootstrap";
import "./Header.css";
import logo from "../assets/images/image1.jpg";
import { HeaderKovilMenu } from "./HeaderKovilMenu";
import { HeaderFreeMenu } from "./HeaderFreeMenu";
import { HeaderAdminMenu } from "./HeaderAdminMenu";
import { HeaderSuperAdminMenu } from "./HeaderSuperAdminMenu";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [role, setRole] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setRole(getUserRole());
    setUserInitials(getUserInitials());

    const handleUserChange = () => {
      setRole(getUserRole());
      setUserInitials(getUserInitials());
    };

    window.addEventListener("userChanged", handleUserChange);
    window.addEventListener("storage", handleUserChange);

    return () => {
      window.removeEventListener("userChanged", handleUserChange);
      window.removeEventListener("storage", handleUserChange);
    };
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <div className="navbar">
      <div className="logo"></div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {/* Admin Menus */}
        {role === "free" && (
          <HeaderFreeMenu
            openDropdown={openDropdown}
            menuOpen={menuOpen}
            Link={Link}
            closeMenu={closeMenu}
          />
        )}

        {/* Admin Menus */}
        {role === "super-admin" && (
          <HeaderSuperAdminMenu
            openDropdown={openDropdown}
            menuOpen={menuOpen}
            Link={Link}
            closeMenu={closeMenu}
          />
        )}

        {/* Admin Menus */}
        {role === "admin" && (
          <HeaderAdminMenu
            openDropdown={openDropdown}
            menuOpen={menuOpen}
            Link={Link}
            closeMenu={closeMenu}
          />
        )}

        {/* Customer Menus */}
        {role === "customer" && (
          <HeaderKovilMenu
            openDropdown={openDropdown}
            menuOpen={menuOpen}
            Link={Link}
            closeMenu={closeMenu}
          />
        )}

        {/* User initials + Logout */}
        {isAuthenticated() ? (
          <li className="user-menu">
            <div
              className="user-initials"
              onClick={() => setShowLogout(!showLogout)}
            >
              {userInitials || "U"}
            </div>
            {showLogout && (
              <div className="logout-dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

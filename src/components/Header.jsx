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
      <div className="logo">
        
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {/* Admin Menus */}
        {role === "free" && (
          <>
            <li>
              <Link to="/">முகப்பு</Link>
            </li>

            {/* Moi List */}
            <li className={`dropdown ${openDropdown === "moi" ? "active" : ""}`}>
              <span className="dropbtn" onClick={() => toggleDropdown("moi")}>
                வாங்கிய மொய் பட்டியல்
              </span>
              <ul
                className={`dropdown-content ${
                  openDropdown === "moi" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/new/moi" onClick={closeMenu}>புதிய மொய்</Link>
                </li>
                <li>
                  <Link to="/all" onClick={closeMenu}>அனைத்து மொய்</Link>
                </li>
                <li>
                  <Link to="/pending_place_group/mois" onClick={closeMenu}>நிலுவையில் உள்ள மொய் ஊர் வரியாக பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/completed_place_group/mois" onClick={closeMenu}>முடிக்கப்பட்ட மொய் ஊர் வரியாக பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/all_place_group/mois" onClick={closeMenu}>அனைத்து மொய் ஊர் வரியாக பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/charts" onClick={closeMenu}>விளக்கப்படங்கள்</Link>
                </li>
              </ul>
            </li>

            {/* Moi Status List */}
            <li
              className={`dropdown ${
                openDropdown === "status" ? "active" : ""
              }`}
            >
              <span
                className="dropbtn"
                onClick={() => toggleDropdown("status")}
              >
                வாங்கிய மொய் நிலை பட்டியல்
              </span>
              <ul
                className={`dropdown-content ${
                  openDropdown === "status" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/pending/lists" onClick={closeMenu}>நிலுவையில் உள்ள மொய் பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/completed/lists" onClick={closeMenu}>முடிக்கப்பட்ட மொய் பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/given_status_group/mois" onClick={closeMenu}>தடவை வரியாக மொய் பட்டியல்</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/mois_search" onClick={closeMenu}>மொய் தேடல்</Link>
            </li>
          </>
        )}

        
        {/* Admin Menus */}
        {role === "super-admin" && (
          <>
            <li>
              <Link to="/">முகப்பு</Link>
            </li>

            {/* Moi List */}
            <li className={`dropdown ${openDropdown === "moi" ? "active" : ""}`}>
              <span className="dropbtn" onClick={() => toggleDropdown("moi")}>
                வாங்கிய மொய் பட்டியல்
              </span>
              <ul
                className={`dropdown-content ${
                  openDropdown === "moi" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/new/moi" onClick={closeMenu}>புதிய மொய்</Link>
                </li>
                <li>
                  <Link to="/all" onClick={closeMenu}>அனைத்து மொய்</Link>
                </li>
                <li>
                  <Link to="/pending_place_group/mois" onClick={closeMenu}>நிலுவையில் உள்ள மொய் ஊர் வரியாக பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/completed_place_group/mois" onClick={closeMenu}>முடிக்கப்பட்ட மொய் ஊர் வரியாக பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/all_place_group/mois" onClick={closeMenu}>அனைத்து மொய் ஊர் வரியாக பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/charts" onClick={closeMenu}>விளக்கப்படங்கள்</Link>
                </li>
              </ul>
            </li>

            {/* Moi Status List */}
            <li
              className={`dropdown ${
                openDropdown === "status" ? "active" : ""
              }`}
            >
              <span
                className="dropbtn"
                onClick={() => toggleDropdown("status")}
              >
                வாங்கிய மொய் நிலை பட்டியல்
              </span>
              <ul
                className={`dropdown-content ${
                  openDropdown === "status" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/pending/lists" onClick={closeMenu}>நிலுவையில் உள்ள மொய் பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/completed/lists" onClick={closeMenu}>முடிக்கப்பட்ட மொய் பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/given_status_group/mois" onClick={closeMenu}>தடவை வரியாக மொய் பட்டியல்</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/mois_search" onClick={closeMenu}>மொய் தேடல்</Link>
            </li>

            {/* ✅ Fixed Loan List Dropdown */}
            <li className={`dropdown ${openDropdown === "loan" ? "active" : ""}`}>
              <span className="dropbtn" onClick={() => toggleDropdown("loan")}>
                செய்த மொய் பட்டியல்
              </span>
              <ul
                className={`dropdown-content ${
                  openDropdown === "loan" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/new/loan" onClick={closeMenu}>புதிய மொய்</Link>
                </li>
                <li>
                  <Link to="/loans" onClick={closeMenu}>அனைத்து மொய்</Link>
                </li>
                
                <li>
                  <Link to="/name_group/loans" onClick={closeMenu}>அனைத்து பெயர் வரியாக மொய் பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/place_group/loans" onClick={closeMenu}>அனைத்து ஊர் வரியாக மொய் பட்டியல்</Link>
                </li>
              </ul>
            </li>
          </>
        )}

        {/* Admin Menus */}
        {role === "admin" && (
          <>
            <li>
              <Link to="/">முகப்பு</Link>
            </li>

            {/* Moi List */}
            <li className={`dropdown ${openDropdown === "moi" ? "active" : ""}`}>
              <span className="dropbtn" onClick={() => toggleDropdown("moi")}>
                வாங்கிய மொய் பட்டியல்
              </span>
              <ul
                className={`dropdown-content ${
                  openDropdown === "moi" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/all" onClick={closeMenu}>அனைத்து மொய்</Link>
                </li>
                <li>
                  <Link to="/new/moi" onClick={closeMenu}>புதிய மொய்</Link>
                </li>
                
                <li>
                  <Link to="/pending/name_group" onClick={closeMenu}>நிலுவையில் உள்ள மொய் பெயர் வரியாக பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/complete/name_group" onClick={closeMenu}>முடிக்கப்பட்ட மொய் பெயர் வரியாக பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/all_name_group" onClick={closeMenu}>அனைத்து மொய் பெயர் வரியாக பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/mois_charts" onClick={closeMenu}>விளக்கப்படங்கள்</Link>
                </li>
                <li>
                  <Link to="/nannu-register" onClick={closeMenu}>பயனர் பதிவு</Link>
                </li>
                <li>
                  <Link to="/users" onClick={closeMenu}>பயனர் பட்டியல்</Link>
                </li>
              </ul>
            </li>

            {/* Moi Status List */}
            <li
              className={`dropdown ${
                openDropdown === "status" ? "active" : ""
              }`}
            >
              <span
                className="dropbtn"
                onClick={() => toggleDropdown("status")}
              >
                வாங்கிய மொய் நிலை பட்டியல்
              </span>
              <ul
                className={`dropdown-content ${
                  openDropdown === "status" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/pending/lists" onClick={closeMenu}>நிலுவையில் உள்ள மொய் பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/completed/lists" onClick={closeMenu}>முடிக்கப்பட்ட மொய் பட்டியல்</Link>
                </li>
              </ul>
            </li>

            

            <li>
              <Link to="/mois_search" onClick={closeMenu}>மொய் தேடல்</Link>
            </li>
            {/* Moi bulk create and backup*/}
            <li
              className={`dropdown ${
                openDropdown === "status" ? "active" : ""
              }`}
            >
              <span
                className="dropbtn"
                onClick={() => toggleDropdown("status")}
              >
                மொய் கோப்பு
              </span>
              <ul
                className={`dropdown-content ${
                  openDropdown === "status" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/moi_create/upload" onClick={closeMenu}>மொய் மொத்தமாக உருவாக்கு</Link>
                </li>
                <li>
                  <Link to="/moi_data_backup" onClick={closeMenu}>மொய் காப்பு கோப்பு</Link>
                </li>
              </ul>
            </li>

            {/* ✅ Fixed Loan List Dropdown */}
            <li className={`dropdown ${openDropdown === "loan" ? "active" : ""}`}>
              <span className="dropbtn" onClick={() => toggleDropdown("loan")}>
                செய்த மொய் பட்டியல்
              </span>
              <ul
                className={`dropdown-content ${
                  openDropdown === "loan" ? "show" : ""
                }`}
              >
                <li>
                  <Link to="/new/loan" onClick={closeMenu}>புதிய மொய்</Link>
                </li>
                <li>
                  <Link to="/loans" onClick={closeMenu}>அனைத்து மொய்</Link>
                </li>
                
                <li>
                  <Link to="/name_group/loans" onClick={closeMenu}>அனைத்து பெயர் வரியாக மொய் பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/place_group/loans" onClick={closeMenu}>அனைத்து ஊர் வரியாக மொய் பட்டியல்</Link>
                </li>
              </ul>
            </li>
          </>
        )}

        {/* Customer Menus */}
{role === "customer" && (
  <>
    

    {/* INCOME MENU */}
    <li
      className={`dropdown ${
        openDropdown === "income"
          ? "active"
          : ""
      }`}
    >
      <span
        className="dropbtn"
        onClick={() =>
          toggleDropdown("income")
        }
      >
        கோவில் வரவு
      </span>

      <ul
        className={`dropdown-content ${
          openDropdown === "income"
            ? "show"
            : ""
        }`}
      >
        <li>
          <Link
            to="/newIncome"
            onClick={closeMenu}
          >
            புதிய வரவு
          </Link>
        </li>

        <li>
          <Link
            to="/kovil/income_list"
            onClick={closeMenu}
          >
            மொத்த வரவு பட்டியல்
          </Link>
        </li>

        <li>
          <Link
            to="/kovil/income_group"
            onClick={closeMenu}
          >
            வரவு வகை பட்டியல்
          </Link>
        </li>

        <li>
          <Link
            to="/kovil/income_date_group"
            onClick={closeMenu}
          >
            தேதி வரியாக வரவு பட்டியல்
          </Link>
        </li>
      </ul>
    </li>

    {/* OUTGOING MENU */}
    <li
      className={`dropdown ${
        openDropdown === "outgoing"
          ? "active"
          : ""
      }`}
    >
      <span
        className="dropbtn"
        onClick={() =>
          toggleDropdown("outgoing")
        }
      >
        கோவில் செலவு
      </span>

      <ul
        className={`dropdown-content ${
          openDropdown === "outgoing"
            ? "show"
            : ""
        }`}
      >
        <li>
          <Link
            to="/newOutgoing"
            onClick={closeMenu}
          >
            புதிய செலவு
          </Link>
        </li>

        <li>
          <Link
            to="/kovil/outgoing_list"
            onClick={closeMenu}
          >
            மொத்த செலவு பட்டியல்
          </Link>
        </li>

        <li>
          <Link
            to="/kovil/outgoing_group"
            onClick={closeMenu}
          >
            செலவு வகை பட்டியல்
          </Link>
        </li>

        <li>
          <Link
            to="/kovil/outgoing_date_group"
            onClick={closeMenu}
          >
            தேதி வரியாக செலவு பட்டியல்
          </Link>
        </li>
      </ul>
    </li>

    {/* SUMMARY MENU */}
    <li
      className={`dropdown ${
        openDropdown === "summary"
          ? "active"
          : ""
      }`}
    >
      <span
        className="dropbtn"
        onClick={() =>
          toggleDropdown("summary")
        }
      >
        கோவில் மொத்த வரவு செலவு
      </span>

      <ul
        className={`dropdown-content ${
          openDropdown === "summary"
            ? "show"
            : ""
        }`}
      >
        <li>
          <Link
            to="/kovil/summary"
            onClick={closeMenu}
          >
            மொத்த வரவு செலவு
          </Link>
        </li>

        <li>
          <Link
            to="/kovil/balances"
            onClick={closeMenu}
          >
            கடந்த வருட மீதம்
          </Link>
        </li>
      </ul>
    </li>




    {/* Room menu income */}
    <li
      className={`dropdown ${
        openDropdown === "room-income"
          ? "active"
          : ""
      }`}
    >
      <span
        className="dropbtn"
        onClick={() =>
          toggleDropdown("room-income")
        }
      >
        கோவில் அறை கட்டும் வரவு
      </span>

      <ul
        className={`dropdown-content ${
          openDropdown === "summary"
            ? "show"
            : ""
        }`}
      >
        <li>
          <Link
            to="/donation/income/new"
            onClick={closeMenu}
          >
            புதிய வரவு
          </Link>
        </li>

        <li>
          <Link
            to="/donation/incomes"
            onClick={closeMenu}
          >
            மொத்த வரவு பட்டியல்
          </Link>
        </li>
        <li>
          <Link
            to="/donation/income_group"
            onClick={closeMenu}
          >
            வரவு வகை பட்டியல்
          </Link>
        </li>
      </ul>
    </li>

    {/* Room menu outgiong */}
    <li
      className={`dropdown ${
        openDropdown === "room-outgoing"
          ? "active"
          : ""
      }`}
    >
      <span
        className="dropbtn"
        onClick={() =>
          toggleDropdown("room-outgoing")
        }
      >
        கோவில் அறை கட்டும் செலவு
      </span>

      <ul
        className={`dropdown-content ${
          openDropdown === "room-outgoing"
            ? "show"
            : ""
        }`}
      >
        <li>
          <Link
            to="/donation/outgoing/new"
            onClick={closeMenu}
          >
            புதிய செலவு
          </Link>
        </li>

        <li>
          <Link
            to="/donation/outgoings"
            onClick={closeMenu}
          >
            மொத்த செலவு பட்டியல்
          </Link>
        </li>
        <li>
          <Link
            to="/donation/outgoing_group"
            onClick={closeMenu}
          >
            செலவு வகை பட்டியல்
          </Link>
        </li>
        <li>
          <Link
            to="/donation/outgoing_date_group"
            onClick={closeMenu}
          >
            தேதி வரியாக செலவு பட்டியல்
          </Link>
        </li>
      </ul>
    </li>

    {/* SUMMARY MENU room*/}
    <li
      className={`dropdown ${
        openDropdown === "room-summary"
          ? "active"
          : ""
      }`}
    >
      <span
        className="dropbtn"
        onClick={() =>
          toggleDropdown("room-summary")
        }
      >
        கோவில் அறை கட்டும் மொத்த வரவு செலவு
      </span>

      <ul
        className={`dropdown-content ${
          openDropdown === "room-summary"
            ? "show"
            : ""
        }`}
      >
        <li>
          <Link
            to="/donation/summary"
            onClick={closeMenu}
          >
            மொத்த வரவு செலவு
          </Link>
        </li>
      </ul>
    </li>
  </>
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

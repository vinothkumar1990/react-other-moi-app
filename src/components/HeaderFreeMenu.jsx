import React from "react";

export const HeaderFreeMenu = ({ openDropdown, Link, closeMenu }) => {
  return (
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
          className={`dropdown-content ${openDropdown === "moi" ? "show" : ""}`}
        >
          <li>
            <Link to="/new/moi" onClick={closeMenu}>
              புதிய மொய்
            </Link>
          </li>
          <li>
            <Link to="/all" onClick={closeMenu}>
              அனைத்து மொய்
            </Link>
          </li>
          <li>
            <Link to="/pending_place_group/mois" onClick={closeMenu}>
              நிலுவையில் உள்ள மொய் ஊர் வரியாக பட்டியல்
            </Link>
          </li>
          <li>
            <Link to="/completed_place_group/mois" onClick={closeMenu}>
              முடிக்கப்பட்ட மொய் ஊர் வரியாக பட்டியல்
            </Link>
          </li>
          <li>
            <Link to="/all_place_group/mois" onClick={closeMenu}>
              அனைத்து மொய் ஊர் வரியாக பட்டியல்
            </Link>
          </li>
          <li>
            <Link to="/charts" onClick={closeMenu}>
              விளக்கப்படங்கள்
            </Link>
          </li>
        </ul>
      </li>

      {/* Moi Status List */}
      <li className={`dropdown ${openDropdown === "status" ? "active" : ""}`}>
        <span className="dropbtn" onClick={() => toggleDropdown("status")}>
          வாங்கிய மொய் நிலை பட்டியல்
        </span>
        <ul
          className={`dropdown-content ${
            openDropdown === "status" ? "show" : ""
          }`}
        >
          <li>
            <Link to="/pending/lists" onClick={closeMenu}>
              நிலுவையில் உள்ள மொய் பட்டியல்
            </Link>
          </li>
          <li>
            <Link to="/completed/lists" onClick={closeMenu}>
              முடிக்கப்பட்ட மொய் பட்டியல்
            </Link>
          </li>
          <li>
            <Link to="/given_status_group/mois" onClick={closeMenu}>
              தடவை வரியாக மொய் பட்டியல்
            </Link>
          </li>
        </ul>
      </li>

      <li>
        <Link to="/mois_search" onClick={closeMenu}>
          மொய் தேடல்
        </Link>
      </li>
    </>
  );
};

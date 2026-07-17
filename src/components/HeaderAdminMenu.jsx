import React from "react";

export const HeaderAdminMenu = ({ openDropdown, Link, closeMenu }) => {
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
            <Link to="/all" onClick={closeMenu}>
              அனைத்து மொய்
            </Link>
          </li>
          <li>
            <Link to="/new/moi" onClick={closeMenu}>
              புதிய மொய்
            </Link>
          </li>

          <li>
            <Link to="/pending/name_group" onClick={closeMenu}>
              நிலுவையில் உள்ள மொய் பெயர் வரியாக பட்டியல்
            </Link>
          </li>
          <li>
            <Link to="/complete/name_group" onClick={closeMenu}>
              முடிக்கப்பட்ட மொய் பெயர் வரியாக பட்டியல்
            </Link>
          </li>
          <li>
            <Link to="/all_name_group" onClick={closeMenu}>
              அனைத்து மொய் பெயர் வரியாக பட்டியல்
            </Link>
          </li>
          <li>
            <Link to="/mois_charts" onClick={closeMenu}>
              விளக்கப்படங்கள்
            </Link>
          </li>
          <li>
            <Link to="/nannu-register" onClick={closeMenu}>
              பயனர் பதிவு
            </Link>
          </li>
          <li>
            <Link to="/users" onClick={closeMenu}>
              பயனர் பட்டியல்
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
        </ul>
      </li>

      <li>
        <Link to="/mois_search" onClick={closeMenu}>
          மொய் தேடல்
        </Link>
      </li>
      {/* Moi bulk create and backup*/}
      <li className={`dropdown ${openDropdown === "status" ? "active" : ""}`}>
        <span className="dropbtn" onClick={() => toggleDropdown("status")}>
          மொய் கோப்பு
        </span>
        <ul
          className={`dropdown-content ${
            openDropdown === "status" ? "show" : ""
          }`}
        >
          <li>
            <Link to="/moi_create/upload" onClick={closeMenu}>
              மொய் மொத்தமாக உருவாக்கு
            </Link>
          </li>
          <li>
            <Link to="/moi_data_backup" onClick={closeMenu}>
              மொய் காப்பு கோப்பு
            </Link>
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
            <Link to="/new/loan" onClick={closeMenu}>
              புதிய மொய்
            </Link>
          </li>
          <li>
            <Link to="/loans" onClick={closeMenu}>
              அனைத்து மொய்
            </Link>
          </li>

          <li>
            <Link to="/name_group/loans" onClick={closeMenu}>
              அனைத்து பெயர் வரியாக மொய் பட்டியல்
            </Link>
          </li>
          <li>
            <Link to="/place_group/loans" onClick={closeMenu}>
              அனைத்து ஊர் வரியாக மொய் பட்டியல்
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
};

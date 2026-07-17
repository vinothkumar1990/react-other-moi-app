import React from "react";

export const HeaderKovilMenu = ({ openDropdown, Link, closeMenu }) => {
  return (
    <>
      {/* INCOME MENU */}
      <li className={`dropdown ${openDropdown === "income" ? "active" : ""}`}>
        <span className="dropbtn" onClick={() => toggleDropdown("income")}>
          கோவில் வரவு
        </span>

        <ul
          className={`dropdown-content ${
            openDropdown === "income" ? "show" : ""
          }`}
        >
          <li>
            <Link to="/newIncome" onClick={closeMenu}>
              புதிய வரவு
            </Link>
          </li>

          <li>
            <Link to="/kovil/income_list" onClick={closeMenu}>
              மொத்த வரவு பட்டியல்
            </Link>
          </li>

          <li>
            <Link to="/kovil/income_group" onClick={closeMenu}>
              வரவு வகை பட்டியல்
            </Link>
          </li>

          <li>
            <Link to="/kovil/income_date_group" onClick={closeMenu}>
              தேதி வரியாக வரவு பட்டியல்
            </Link>
          </li>
        </ul>
      </li>

      {/* OUTGOING MENU */}
      <li className={`dropdown ${openDropdown === "outgoing" ? "active" : ""}`}>
        <span className="dropbtn" onClick={() => toggleDropdown("outgoing")}>
          கோவில் செலவு
        </span>

        <ul
          className={`dropdown-content ${
            openDropdown === "outgoing" ? "show" : ""
          }`}
        >
          <li>
            <Link to="/newOutgoing" onClick={closeMenu}>
              புதிய செலவு
            </Link>
          </li>

          <li>
            <Link to="/kovil/outgoing_list" onClick={closeMenu}>
              மொத்த செலவு பட்டியல்
            </Link>
          </li>

          <li>
            <Link to="/kovil/outgoing_group" onClick={closeMenu}>
              செலவு வகை பட்டியல்
            </Link>
          </li>

          <li>
            <Link to="/kovil/outgoing_date_group" onClick={closeMenu}>
              தேதி வரியாக செலவு பட்டியல்
            </Link>
          </li>
        </ul>
      </li>

      {/* SUMMARY MENU */}
      <li className={`dropdown ${openDropdown === "summary" ? "active" : ""}`}>
        <span className="dropbtn" onClick={() => toggleDropdown("summary")}>
          கோவில் மொத்த வரவு செலவு
        </span>

        <ul
          className={`dropdown-content ${
            openDropdown === "summary" ? "show" : ""
          }`}
        >
          <li>
            <Link to="/kovil/summary" onClick={closeMenu}>
              மொத்த வரவு செலவு
            </Link>
          </li>

          <li>
            <Link to="/kovil/balances" onClick={closeMenu}>
              கடந்த வருட மீதம்
            </Link>
          </li>
        </ul>
      </li>

      {/* Room menu income */}
      <li
        className={`dropdown ${openDropdown === "room-income" ? "active" : ""}`}
      >
        <span className="dropbtn" onClick={() => toggleDropdown("room-income")}>
          கோவில் அறை கட்டும் வரவு
        </span>

        <ul
          className={`dropdown-content ${
            openDropdown === "summary" ? "show" : ""
          }`}
        >
          <li>
            <Link to="/donation/income/new" onClick={closeMenu}>
              புதிய வரவு
            </Link>
          </li>

          <li>
            <Link to="/donation/incomes" onClick={closeMenu}>
              மொத்த வரவு பட்டியல்
            </Link>
          </li>
          <li>
            <Link to="/donation/income_group" onClick={closeMenu}>
              வரவு வகை பட்டியல்
            </Link>
          </li>
        </ul>
      </li>

      {/* Room menu outgiong */}
      <li
        className={`dropdown ${
          openDropdown === "room-outgoing" ? "active" : ""
        }`}
      >
        <span
          className="dropbtn"
          onClick={() => toggleDropdown("room-outgoing")}
        >
          கோவில் அறை கட்டும் செலவு
        </span>

        <ul
          className={`dropdown-content ${
            openDropdown === "room-outgoing" ? "show" : ""
          }`}
        >
          <li>
            <Link to="/donation/outgoing/new" onClick={closeMenu}>
              புதிய செலவு
            </Link>
          </li>

          <li>
            <Link to="/donation/outgoings" onClick={closeMenu}>
              மொத்த செலவு பட்டியல்
            </Link>
          </li>
          <li>
            <Link to="/donation/outgoing_group" onClick={closeMenu}>
              செலவு வகை பட்டியல்
            </Link>
          </li>
          <li>
            <Link to="/donation/outgoing_date_group" onClick={closeMenu}>
              தேதி வரியாக செலவு பட்டியல்
            </Link>
          </li>
        </ul>
      </li>

      {/* SUMMARY MENU room*/}
      <li
        className={`dropdown ${
          openDropdown === "room-summary" ? "active" : ""
        }`}
      >
        <span
          className="dropbtn"
          onClick={() => toggleDropdown("room-summary")}
        >
          கோவில் அறை கட்டும் மொத்த வரவு செலவு
        </span>

        <ul
          className={`dropdown-content ${
            openDropdown === "room-summary" ? "show" : ""
          }`}
        >
          <li>
            <Link to="/donation/summary" onClick={closeMenu}>
              மொத்த வரவு செலவு
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
};

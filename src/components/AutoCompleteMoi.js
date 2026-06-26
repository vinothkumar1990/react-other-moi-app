import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AutoComplete.css";

export const AutoCompleteMoi = ({ onSelectName, onSelectPlace }) => {
  const [mois, setMois] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [placeInput, setPlaceInput] = useState("");
  const [filteredNames, setFilteredNames] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [showNames, setShowNames] = useState(false);
  const [showPlaces, setShowPlaces] = useState(false);

  useEffect(() => {
    const fetchMois = async () => {
      try {
        const res = await axios.get(
          "https://ievyooeawrzhkemxfswj.supabase.co/rest/v1/mois",
          {
            headers: {
              apikey:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI",
              "Content-Type": "application/json",
            },
          }
        );
        setMois(res.data || []);
      } catch (err) {
        console.error("Error fetching MOI data:", err);
      }
    };

    fetchMois();
  }, []);

  // 🔍 Filter by name
  const handleNameChange = (e) => {
    const val = e.target.value;
    setNameInput(val);
    if (val.trim() !== "") {
      const results = mois
        .filter(
          (m) => m.name && m.name.toLowerCase().includes(val.toLowerCase())
        )
        .slice(0, 10);
      setFilteredNames(results);
      setShowNames(true);
    } else {
      setFilteredNames([]);
      setShowNames(false);
    }
  };

  // 🔍 Filter by place
  const handlePlaceChange = (e) => {
    const val = e.target.value;
    setPlaceInput(val);
    if (val.trim() !== "") {
      const results = mois
        .filter(
          (m) => m.place && m.place.toLowerCase().includes(val.toLowerCase())
        )
        .slice(0, 10);
      setFilteredPlaces(results);
      setShowPlaces(true);
    } else {
      setFilteredPlaces([]);
      setShowPlaces(false);
    }
  };

  const handleSelectName = (name) => {
    setNameInput(name);
    setShowNames(false);
    if (onSelectName) onSelectName(name);
  };

  const handleSelectPlace = (place) => {
    setPlaceInput(place);
    setShowPlaces(false);
    if (onSelectPlace) onSelectPlace(place);
  };

  return (
    <div className="autocomplete-container">
      {/* 👤 Name Field */}
      <div className="autocomplete-field">
        <label>👤 Name</label>
        <input
          type="text"
          value={nameInput}
          onChange={handleNameChange}
          placeholder="Type name..."
          onFocus={() => setShowNames(true)}
          onBlur={() => setTimeout(() => setShowNames(false), 200)}
        />
        {showNames && filteredNames.length > 0 && (
          <ul className="autocomplete-list">
            {filteredNames.map((item) => (
              <li key={item.id} onClick={() => handleSelectName(item.name)}>
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 📍 Place Field */}
      <div className="autocomplete-field">
        <label>📍 Place</label>
        <input
          type="text"
          value={placeInput}
          onChange={handlePlaceChange}
          placeholder="Type place..."
          onFocus={() => setShowPlaces(true)}
          onBlur={() => setTimeout(() => setShowPlaces(false), 200)}
        />
        {showPlaces && filteredPlaces.length > 0 && (
          <ul className="autocomplete-list">
            {filteredPlaces.map((item) => (
              <li key={item.id} onClick={() => handleSelectPlace(item.place)}>
                {item.place}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

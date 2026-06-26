import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import data from "../assets/mois.json";
import image1 from "../assets/images/slide1.jpg";
import image2 from "../assets/images/slide2.jpg";
import image3 from "../assets/images/slide3.jpg";
import image4 from "../assets/images/slide4.jpg";
import image5 from "../assets/images/slide5.jpg";
import useData from "./custom-hook/useData";

const images = [image1, image2, image3, image4, image5];

export const Slides = () => {
  // Logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userFunction = loggedInUser?.function_name || "";

  // Fetch Supabase data
  const { products, error, isLoading } = useData(
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

  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    let list = [];

    // Supabase or local backup
    if (products && products.length > 0) {
      list = [...products];
    } else {
      list = [...data];
    }

    // ✅ FILTERING BASED ON LOGGED-IN USER FUNCTION NAME
    const byFunction = list.filter(
      (item) =>
        String(item.function_name).trim().toLowerCase() ===
        String(userFunction).trim().toLowerCase()
    );

    // If no matching records → show nothing
    if (byFunction.length === 0) {
      setFilteredList([]);
      return;
    }

    // Sort by new_amount → top 5
    const sorted = byFunction
      .filter((item) => item.new_amount)
      .sort((a, b) => Number(b.new_amount || 0) - Number(a.new_amount || 0))
      .slice(0, 5);

    setFilteredList(sorted);
  }, [products, userFunction]);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h5>Loading slides...</h5>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching data:", error);
  }

  // If no slides after filtering → show message
  if (filteredList.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        <h5>No records found for your function: <b>{userFunction}</b></h5>
      </div>
    );
  }

  return (
    <Carousel data-bs-theme="dark" interval={2500} fade>
      {filteredList.map((product, index) => (
        <Carousel.Item key={product.id || index}>
          <div
            style={{
              width: "100%",
              height: "70vh",
              maxHeight: "650px",
              minHeight: "400px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={images[index % images.length]}
              alt={`Slide ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                transition: "transform 1.2s ease-in-out",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))",
              }}
            ></div>

            <Carousel.Caption
              style={{
                position: "absolute",
                bottom: "30px",
                backgroundColor: "rgba(0,0,0,0.45)",
                borderRadius: "10px",
                padding: "12px 20px",
                maxWidth: "80%",
              }}
            >
              <h5
                style={{
                  color: "#1bcabc",
                  fontWeight: "bold",
                  fontSize: "1.6rem",
                }}
              >
                {product.name}
              </h5>

              <p
                style={{
                  color: "#fff",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                }}
              >
                {product.place} — ₹{product.new_amount} —{" "}
                {product.function_name}
              </p>
            </Carousel.Caption>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

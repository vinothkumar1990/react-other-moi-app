import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { OrbitProgress } from "react-loading-indicators";
import useData from "./custom-hook/useData";
import data from "../assets/mois.json";
import "./Home.css";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export const Chart = () => {
  const { products, isLoading } = useData(
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

  const [mois, setMois] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔑 Get logged-in user's function_name
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userFunction = loggedInUser?.function_name || "";

  // Load + Filter data
  useEffect(() => {
    if (products && products.length > 0) {
      const filtered = products.filter(
        (item) => item.function_name === userFunction
      );
      setMois(filtered);
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        const filtered = data.filter(
          (item) => item.function_name === userFunction
        );
        setMois(filtered);
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [products, userFunction]);

  // 🎨 Color palette
  const colors = [
    "rgba(21, 56, 153, 0.7)",
    "rgba(21, 128, 53, 0.7)",
    "rgba(184, 35, 35, 0.7)",
    "rgba(255, 159, 64, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(75, 192, 192, 0.7)",
  ];

  // 📌 Group New & Old Amount (filtered data only)
  const grouped = mois.reduce(
    (acc, item) => {
      const place = item.place || "Unknown";
      const newAmt = Number(item.new_amount) || 0;
      const oldAmt = Number(item.old_amount) || 0;

      if (!acc.new[place]) acc.new[place] = 0;
      if (!acc.old[place]) acc.old[place] = 0;

      acc.new[place] += newAmt;
      acc.old[place] += oldAmt;

      return acc;
    },
    { new: {}, old: {} }
  );

  const places = Object.keys(grouped.new);
  const chartColors = places.map((_, i) => colors[i % colors.length]);

  // NEW Amount Bar chart
  const chartDataNew = {
    labels: places,
    datasets: [
      {
        label: "New Amount",
        data: Object.values(grouped.new),
        backgroundColor: chartColors,
        borderColor: chartColors.map((c) => c.replace("0.7", "1")),
        borderWidth: 1,
      },
    ],
  };

  // OLD Amount Doughnut
  const chartDataOld = {
    labels: places,
    datasets: [
      {
        label: "Old Amount",
        data: Object.values(grouped.old),
        backgroundColor: chartColors,
        borderColor: chartColors.map((c) => c.replace("0.7", "1")),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: { y: { beginAtZero: true } },
  };

  // Loader
  if (loading || isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <OrbitProgress color="#32cd32" size="medium" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* NEW Amount Bar */}
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h3 style={{ textAlign: "center", color: "#153899" }}>
          {userFunction} — New Amount
        </h3>
        <Bar data={chartDataNew} options={chartOptions} />
      </div>

      {/* OLD Amount Doughnut */}
      <div style={{ maxWidth: "800px", margin: "40px auto" }}>
        <h3 style={{ textAlign: "center", color: "#128035" }}>
          {userFunction} — Old Amount
        </h3>
        <Doughnut data={chartDataOld} options={chartOptions} />
      </div>
    </div>
  );
};

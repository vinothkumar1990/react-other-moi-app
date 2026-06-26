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
import useData from "./custom-hook/useData"; // ✅ Ensure your hook path is correct
import data from "../assets/mois.json";
import "./Home.css";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

export const ChartRelo = () => {
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

  const [mois, setMois] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load Supabase data or fallback to local JSON
  useEffect(() => {
    if (products && products.length > 0) {
      setMois(products);
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setMois(data);
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [products]);

  // ✅ Define consistent colors for each function
  const colorMap = {
    "வினோத் திருமணம்": "rgba(21, 56, 153, 0.7)",
    "விக்னேஷ் திருமணம்": "rgba(21, 128, 53, 0.7)",
    "விஜய் திருமணம்": "rgba(184, 35, 35, 0.7)",
    Others: "rgba(201, 203, 207, 0.7)",
  };

  // ✅ Filter pending records
  const filteredMois = mois.filter((item) => item.status === "pending");

  // ✅ Group total new_amount by function name (all)
  const groupedByFunction = mois.reduce((acc, item) => {
    const func = item.function_name || "Others";
    const amount = Number(item.new_amount) || 0;
    if (!acc[func]) acc[func] = 0;
    acc[func] += amount;
    return acc;
  }, {});

  // ✅ Group total new_amount by function name (pending only)
  const groupedByPendingFunction = filteredMois.reduce((acc, item) => {
    const func = item.function_name || "Others";
    const amount = Number(item.new_amount) || 0;
    if (!acc[func]) acc[func] = 0;
    acc[func] += amount;
    return acc;
  }, {});

  // ✅ Bar Chart (All)
  const chartData = {
    labels: Object.keys(groupedByFunction),
    datasets: [
      {
        label: "Total New Amount by Function",
        data: Object.values(groupedByFunction),
        backgroundColor: Object.keys(groupedByFunction).map(
          (label) => colorMap[label] || colorMap["Others"]
        ),
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // ✅ Doughnut Chart (Pending)
  const pendingLabels = Object.keys(groupedByPendingFunction);
  const pendingColors = pendingLabels.map(
    (label) => colorMap[label] || colorMap["Others"]
  );

  const chartDataPending = {
    labels: pendingLabels,
    datasets: [
      {
        label: "Total New Amount (Pending Only)",
        data: Object.values(groupedByPendingFunction),
        backgroundColor: pendingColors,
        borderColor: pendingColors.map((c) => c.replace("0.7", "1")),
        borderWidth: 1,
      },
    ],
  };

  // ✅ Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // ✅ Loader
  if (loading || isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <center>
          <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />
        </center>
      </div>
    );
  }

  // ✅ Render Charts
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h3 style={{ textAlign: "center", color: "#0275d8" }}>
          திருமண விழா - புதிய பணம் (All Records)
        </h3>
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div style={{ maxWidth: "800px", margin: "40px auto" }}>
        <h3 style={{ textAlign: "center", color: "rgb(10, 68, 25)" }}>
          திருமண விழா - புதிய பணம் (Pending Status Only)
        </h3>
        <Doughnut data={chartDataPending} options={chartOptions} />
      </div>
    </div>
  );
};

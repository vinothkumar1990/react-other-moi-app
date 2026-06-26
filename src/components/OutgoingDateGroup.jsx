import React, { useEffect, useState } from "react";
import { BlinkBlur } from "react-loading-indicators";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import dayjs from "dayjs";

import { outgoing_api } from "../utils/outgoing-api";
import "../styles/print.css";

export const OutgoingDateGroup = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FETCH DATA
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const res = await outgoing_api.get("/outgoing?select=*");

      // ✅ SORT DATE ASCENDING
      const sortedData = (res.data || []).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setProducts(sortedData);
    } catch (err) {
      console.error(err);

      setError("Failed to fetch data");

      Swal.fire("Error!", "Fetch failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LOAD DATA
  useEffect(() => {
    fetchData();
  }, []);

  // 🧮 GROUP BY DATE
  const grouped = products.reduce((acc, curr) => {
    if (!acc[curr.date]) {
      acc[curr.date] = [];
    }

    acc[curr.date].push(curr);

    return acc;
  }, {});

  const thStyle = {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
    backgroundColor: "#0275d8",
    color: "white",
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
    wordBreak: "break-word",
  };

  const tdTotalStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
    color: "#39740c",
    fontWeight: "bold",
  };

  // 🖨️ PRINT
  const handlePrint = () => {
    window.print();
  };

  // 🔄 LOADING
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <center>
          <BlinkBlur
            color="#d62560"
            size="large"
            text=""
            textColor=""
          />
        </center>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px" }}>
      {/* BUTTON SECTION */}
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <button onClick={handlePrint} className="btn btn-success">
          🖨️ Print
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: "15px" }}>
          {error}
        </div>
      )}

      {/* TABLE SECTION */}
      <div style={{ width: "100%" }}>
        {Object.entries(grouped).map(([date, items]) => (
          <div
            key={date}
            style={{
              marginBottom: "30px",
              border: "1px solid #aaa",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            {/* DATE HEADER */}
            <div
              style={{
                backgroundColor: "#0275d8",
                color: "white",
                padding: "10px 15px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {date && dayjs(date).isValid()
                ? dayjs(date).format("DD-MM-YYYY")
                : "-"}
            </div>

            {/* TABLE */}
            <div style={{ overflowX: "auto" }}>
              <table
                width="100%"
                style={{
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                  width: "100%",
                }}
              >
                

                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f7d4e7" : "#e2e2e2",
                        textAlign: "center",
                      }}
                    >
                      <td style={tdStyle}>{item.name}</td>

                      <td style={tdStyle}>
                        ₹ {parseFloat(item.amount || 0).toFixed(2)}
                      </td>

                      <td style={tdStyle}>{item.type}</td>

                      <td style={tdStyle}>{item.description}</td>
                    </tr>
                  ))}

                  {/* 🧾 TOTAL ROW */}
                  <tr
                    style={{
                      backgroundColor: "#dff0d8",
                      textAlign: "center",
                    }}
                  >
                    <td style={tdTotalStyle}>மொத்தம்</td>

                    <td style={tdTotalStyle}>
                      ₹{" "}
                      {items
                        .reduce(
                          (total, item) =>
                            total + parseFloat(item.amount || 0),
                          0
                        )
                        .toFixed(2)}
                    </td>

                    <td style={tdTotalStyle}></td>

                    <td style={tdTotalStyle}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
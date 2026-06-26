import React, { useEffect, useState } from 'react';
import data from "../assets/vinoth.json";
import { FourSquare } from 'react-loading-indicators';
import "./Home.css";
import useData from "./custom-hook/useData"; // Make sure this hook exists

export const VigneshRelo = () => {
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

  // Use local JSON initially if Supabase not ready
  useEffect(() => {
    const timer = setTimeout(() => {
      const filteredData = data.filter(
        (item) => item.function_name === "விக்னேஷ் திருமணம்"
      );
      setMois(filteredData);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // If products fetched successfully, filter only "விக்னேஷ் திருமணம்"
  const filteredProducts =
    products?.filter(
      (item) => item.function_name === "விக்னேஷ் திருமணம்"
    ) || [];

  const grouped = filteredProducts.reduce((acc, curr) => {
    if (!acc[curr.place]) acc[curr.place] = [];
    acc[curr.place].push(curr);
    return acc;
  }, {});

  const thStyle = { padding: '6px', borderBottom: '1px solid #ccc', textAlign: 'center' };
  const tdStyle = { padding: '6px', borderBottom: '1px solid #eee', textAlign: 'center' };
  const tdTotalStyle = { padding: '6px', borderBottom: '1px solid #eee', textAlign: 'center', color: '#39740c', fontWeight: 'bold' };

  // Export CSV for Vinoth Thirumanam only
  const exportToCSV = () => {
    const headers = ['ஊர்', 'பெயர்', 'பழைய பணம்', 'புதிய பணம்', 'தடவை', 'திருமண விழா'];
    const rows = filteredProducts.map(item => [
      item.place,
      item.name,
      item.old_amount,
      item.new_amount,
      item.given_amount_status,
      item.function_name
    ]);

    const csvContent = [
      '\uFEFF' + headers.join(','),
      ...rows.map(row => row.map(f => `"${String(f).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'vinoth_thirumanam_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => window.print();

  if (loading || isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <FourSquare color="#32cd32" size="medium" />
      </div>
    );
  }

  return (
    <div className="vinoth-container">
      <div className="button-container no-print">
        <button className="csv-btn" onClick={exportToCSV}>📄 Download CSV</button>
        <button className="print-btn" onClick={handlePrint}>🖨️ Print</button>
      </div>

      <div className="table-section">
        {Object.entries(grouped).map(([place, items]) => (
          <div key={place} className="place-section">
            <div className="place-header">{place}</div>
            <div className="table-wrapper">
              <table className="vinoth-table">
                <thead>
                  <tr>
                    <th style={thStyle}>ஊர்</th>
                    <th style={thStyle}>பெயர்</th>
                    <th style={thStyle}>பழைய பணம்</th>
                    <th style={thStyle}>புதிய பணம்</th>
                    <th style={thStyle}>தடவை</th>
                    <th style={thStyle}>திருமண விழா</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#f7d4e7' : '#e2e2e2' }}>
                      <td style={tdStyle}>{item.place}</td>
                      <td style={tdStyle}>{item.name}</td>
                      <td style={tdStyle}>{item.old_amount}</td>
                      <td style={tdStyle}>{item.new_amount}</td>
                      <td style={tdStyle}>{item.given_amount_status}</td>
                      <td style={tdStyle}>{item.function_name}</td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: '#dff0d8', fontWeight: 'bold' }}>
                    <td></td>
                    <td></td>
                    <td style={tdTotalStyle}>
                      மொத்தம் பழைய பணம்: {items.reduce((t, i) => t + parseFloat(i.old_amount || 0), 0)}
                    </td>
                    <td style={tdTotalStyle}>
                      மொத்தம் புதிய பணம்: {items.reduce((t, i) => t + parseFloat(i.new_amount || 0), 0)}
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* PRINT STYLES */}
      <style>
        {`
          @media print {
            @page {
              size: landscape;
              margin: 10mm;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background: white;
            }
            .no-print, .navbar, .footer {
              display: none !important;
            }
            table {
              width: 100% !important;
              font-size: 12px !important;
            }
            th, td {
              border: 1px solid #000 !important;
              padding: 8px !important;
              text-align: center !important;
            }
            div {
              overflow: visible !important;
            }
          }
        `}
      </style>
    </div>
  );
};

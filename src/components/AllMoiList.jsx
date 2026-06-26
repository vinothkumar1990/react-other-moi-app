import React, { useEffect, useState } from 'react';
import useFetch from './custom-hook/useFetch';
import data from "../assets/mois.json";
import { OrbitProgress } from 'react-loading-indicators';
import './Home.css';

export const AllMoiList = () => {
  const [products] = useState(data);
  const [mois, setmois] = useState([]);
  const [loading, setLoading] = useState(true);
   

  useEffect(() => {
    const timer = setTimeout(() => {
      setmois(data);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Calculate Totals
  const totalOldAmount = products.reduce((sum, item) => sum + Number(item.old_amount || 0), 0);
  const totalNewAmount = products.reduce((sum, item) => sum + Number(item.new_amount || 0), 0);

  const thStyle = {
    padding: '10px',
    borderBottom: '1px solid #ccc',
    textAlign: 'center',
    color: 'white'
  };

  const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #eee'
  };

  const tdTotalStyle = {
    padding: '10px',
    borderBottom: '1px solid #eee',
    textAlign: 'center',
    color: '#39740c'
  };

  // ✅ CSV Export Function with Totals + UTF-8 BOM
  const exportToCSV = () => {
    const headers = ['ஊர்', 'பெயர்', 'பழைய பணம்', 'புதிய பணம்', 'தடவை', 'திருமண விழா'];
    const rows = products.map(item => [
      item.place,
      item.name,
      item.old_amount,
      item.new_amount,
      item.given_amount_status,
      item.function_name,
      item.status,
      item.function_id
    ]);

    // ✅ Add a blank line + total line at the end
    rows.push([]);
    rows.push(['', 'மொத்தம்:', totalOldAmount, totalNewAmount, '', '']);

    const csvContent = [
      '\uFEFF' + headers.join(','), // UTF-8 BOM + headers
      ...rows.map(row =>
        row
          .map(field => `"${String(field || '').replace(/"/g, '""')}"`) // escape quotes
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'all_moi_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Print Function
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <center><OrbitProgress color="#32cd32" size="medium" /></center>
      </div>
    );
  }

  return (
    <div>
      

      {/* ✅ Buttons Section */}
      <div style={{ textAlign: 'right', margin: '10px 20px' }}>
        <button
          onClick={exportToCSV}
          style={{
            backgroundColor: '#d9534f',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Download CSV
        </button>
        <button
          onClick={handlePrint}
          style={{
            backgroundColor: '#0275d8',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Print Page
        </button>
      </div>

      {/* ✅ Table Section */}
      <div style={{ maxWidth: '100%', width: '100%', padding: '10px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table
            width="100%"
            border="1"
            style={{
              borderCollapse: 'collapse',
              minWidth: '1200px', // ensures all columns visible even on print
              fontSize: '14px'
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#0275d8' }}>
                <th style={thStyle}>ஊர்</th>
                <th style={thStyle}>பெயர்</th>
                <th style={thStyle}>பழைய பணம்</th>
                <th style={thStyle}>புதிய பணம்</th>
                <th style={thStyle}>தடவை</th>
                <th style={thStyle}>திருமண விழா</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    textAlign: 'center',
                    backgroundColor: index % 2 === 0 ? '#f7d4e7' : '#e2e2e2'
                  }}
                >
                  <td style={tdStyle}>{item.place}</td>
                  <td style={tdStyle}>{item.name}</td>
                  <td style={tdStyle}>{item.old_amount}</td>
                  <td style={tdStyle}>{item.new_amount}</td>
                  <td style={tdStyle}>{item.given_amount_status}</td>
                  <td style={tdStyle}>{item.function_name}</td>
                </tr>
              ))}
              <tr
                style={{
                  backgroundColor: '#d1ecf1',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                <td style={tdTotalStyle}></td>
                <td style={tdTotalStyle}>மொத்தம்</td>
                <td style={tdTotalStyle}>{totalOldAmount}</td>
                <td style={tdTotalStyle}>{totalNewAmount}</td>
                <td style={tdTotalStyle}></td>
                <td style={tdTotalStyle}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Print Styles */}
      <style>
        {`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: landscape;
            margin: 10mm;
          }
          button, .slides-container {
            display: none !important;
          }
          table {
            width: 100% !important;
            min-width: 100% !important;
            font-size: 12px !important;
          }
          th, td {
            border: 1px solid #000 !important;
            padding: 8px !important;
          }
          div {
            overflow: visible !important;
          }
          .navbar{display: none !important;}
          .footer{display: none !important;}
        }
      `}
      </style>
    </div>
  );
};

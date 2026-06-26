import React, { useEffect, useState } from 'react';
import data from "../assets/vijay.json";
import "./Home.css";
import { Commet } from 'react-loading-indicators';

export const VijayMoi = () => {
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

  const grouped = products.reduce((acc, curr) => {
    if (!acc[curr.place]) acc[curr.place] = [];
    acc[curr.place].push(curr);
    return acc;
  }, {});

  const thStyle = { padding: '6px', borderBottom: '1px solid #ccc', textAlign: 'center' };
  const tdStyle = { padding: '6px', borderBottom: '1px solid #eee', textAlign: 'center' };
  const tdTotalStyle = { padding: '6px', borderBottom: '1px solid #eee', textAlign: 'center', color: '#39740c', fontWeight: 'bold' };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Commet color="#32cd32" size="medium" />
      </div>
    );
  }

  return (
    <div className="vijay-container">
      

      <div className="button-container no-print" style={{ textAlign: 'right', margin: '10px 20px' }}>
        <button
          onClick={handlePrint}
          style={{ backgroundColor: '#0275d8', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          🖨️ Print
        </button>
      </div>

      <div style={{ width: '100%', padding: '10px' }}>
        {Object.entries(grouped).map(([place, items]) => (
          <div key={place} style={{ marginBottom: '20px', border: '1px solid #aaa', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#0275d8', color: 'white', padding: '10px 15px', fontSize: '18px' }}>
              {place}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%' }} border="1">
                <thead>
                  <tr style={{ backgroundColor: '#f1f1f1' }}>
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
                    <tr key={item.id} style={{ textAlign: 'center', backgroundColor: index % 2 === 0 ? '#f7d4e7' : '#e2e2e2' }}>
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

            /* Hide elements not needed in print */
            .slides-section, .no-print {
              display: none !important;
            }

            /* Ensure table uses full width */
            table {
              width: 100% !important;
              min-width: 100% !important;
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
            .navbar{display: none !important}
            .footer{display: none !important}
          }
        `}
        </style>
    </div>
  );
};

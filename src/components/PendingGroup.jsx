import React, { useEffect, useState } from 'react';
import data from "../assets/pending.json";
import { Atom } from 'react-loading-indicators';
import "./Home.css";


export const PendingGroup = () => {
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
    if (!acc[curr.name]) acc[curr.name] = [];
    acc[curr.name].push(curr);
    return acc;
  }, {});

  const thStyle = { padding: '6px', borderBottom: '1px solid #ccc', textAlign: 'center' };
  const tdStyle = { padding: '6px', borderBottom: '1px solid #eee', textAlign: 'center' };
  const tdTotalStyle = { padding: '6px', borderBottom: '1px solid #eee', textAlign: 'center', color: '#39740c', fontWeight: 'bold' };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Atom color="#32cd32" size="medium" />
      </div>
    );
  }

  return (
    <div className="pending-container">


      {/* Print button */}
      <div className="no-print" style={{ textAlign: 'right', margin: '10px 20px' }}>
        <button
          onClick={handlePrint}
          style={{ backgroundColor: '#0275d8', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          🖨️ Print
        </button>
      </div>

      <div style={{ width: '100%', padding: '10px' }}>
        {Object.entries(grouped).map(([name, items]) => (
          <div key={name} style={{ marginBottom: '20px', border: '1px solid #aaa', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#0275d8', color: 'white', padding: '10px 15px', fontSize: '18px' }}>
              {name}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%' }} border="1">
                <thead>
                  <tr style={{ backgroundColor: '#f1f1f1' }}>
                    <th style={thStyle}>ஊர்</th>
                    <th style={thStyle}>பழைய பணம்</th>
                    <th style={thStyle}>புதிய பணம்</th>
                    <th style={thStyle}>தடவை</th>
                    <th style={thStyle}>திருமண விழா</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#f7d4e7' : '#e2e2e2' }}>
                      <td style={tdStyle}>{item.place}</td>
                      <td style={tdStyle}>{item.old_amount}</td>
                      <td style={tdStyle}>{item.new_amount}</td>
                      <td style={tdStyle}>{item.given_amount_status}</td>
                      <td style={tdStyle}>{item.function_name}</td>
                      <td style={{ ...tdStyle, color: item.status === 'Pending' ? 'green' : 'red' }}>
                        {item.status === 'Pending' ? 'நிலுவையில் உள்ளது' : 'நிறைவு'}
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr style={{ backgroundColor: '#dff0d8', fontWeight: 'bold' }}>
                    <td></td>
                    <td></td>
                    <td style={tdTotalStyle}>
                      மொத்தம்: {items.reduce((total, item) => total + parseFloat(item.new_amount || 0), 0)}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none !important; }
            .pending-container { width: 100%; padding: 0; }
            table { width: 100% !important; font-size: 10px; border: 1px solid #000 !important; }
            th, td { border: 1px solid #000 !important; padding: 4px !important; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            .navbar{display: none !important}
            .footer{display: none !important}
            @page { size: A4 landscape; margin: 5mm; }
          }
        `}
      </style>
    </div>
  );
};

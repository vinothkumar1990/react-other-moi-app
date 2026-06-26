import React, { useEffect, useState } from 'react';
import { Mosaic } from 'react-loading-indicators';
import useFetch from './custom-hook/useFetch';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';
import { income_api } from "../utils/income-api";
import '../styles/print.css';
export const IncomeGroup = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
  
    // ✅ FETCH DATA
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const res = await income_api.get("/income?select=*");
      setProducts(res.data || []);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
      Swal.fire("Error!", "Fetch failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
    // ✅ Load on mount
    useEffect(() => {
      fetchData();
    }, []);

  // 🧮 Group by type
  const grouped = products.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push(curr);
    return acc;
  }, {});

  const thStyle = {
    padding: '10px',
    borderBottom: '1px solid #ccc',
    textAlign: 'center',
    backgroundColor: '#0275d8',
    color: 'white'
  };

  const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #eee',
    textAlign: 'center'
  };

  const tdTotalStyle = {
    padding: '10px',
    borderBottom: '1px solid #eee',
    textAlign: 'center',
    color: '#39740c',
    fontWeight: 'bold'
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <center><Mosaic color="#d62560" size="large" text="" textColor="" /></center>
      </div>
    );
  } else {
    return (
      <div style={{ padding: '10px' }}>
        <div
          className="no-print"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          
          <button
            onClick={handlePrint}
            className="btn btn-success"
            style={{ marginBottom: '10px' }}
          >
            🖨️ Print
          </button>
        </div>

        <div style={{ width: '100%' }}>
          {Object.entries(grouped).map(([type, items]) => (
            <div
              key={type}
              style={{
                marginBottom: '30px',
                border: '1px solid #aaa',
                borderRadius: '5px',
                overflow: 'hidden'
              }}
            >
              <div style={{ backgroundColor: '#0275d8', color: 'white', padding: '10px 15px', fontSize: '18px' }}>
                {type}
              </div>

              <div>
                <table
                  width="100%"
                  style={{
                    borderCollapse: 'collapse',
                    tableLayout: 'fixed',
                    width: '100%'
                  }}
                >
                  
                  <tbody>
                    {items.map((item, index) => (
                      <tr
                        key={item.id}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#f7d4e7' : '#e2e2e2',
                          textAlign: 'center'
                        }}
                      >
                        <td style={tdStyle}>{item.name}</td>
                        <td style={tdStyle}>{item.amount}</td>
                        <td style={tdStyle}>{item.type}</td>
                        <td style={tdStyle}>{item.description}</td>
                      </tr>
                    ))}

                    {/* 🧾 Total Row */}
                    <tr style={{ backgroundColor: '#dff0d8', textAlign: 'center' }}>
                      <td style={tdTotalStyle}>மொத்தம்</td>
                      <td style={tdTotalStyle}>
                        {
                          items.reduce((total, item) => total + parseFloat(item.amount || 0), 0)
                        }
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
  }
};

import React from "react";
import { Commet } from "react-loading-indicators";
import useFetch from "../custom-hook/useFetch";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../utils/api";
import { motion } from "framer-motion";

export const User = () => {
  const navigate = useNavigate();

  const { products, error, isLoading, setProducts } =
    useFetch("users");

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`/users?id=eq.${id}`)
          .then(() => {
            const updatedList = products.filter(
              (item) => item.id !== id
            );
            setProducts(updatedList);

            Swal.fire("Deleted!", "User removed.", "success");
          })
          .catch(() => {
            Swal.fire("Error!", "Delete failed.", "error");
          });
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/update_user/${id}`);
  };

  if (isLoading) {
    return (
      <center>
        <Commet color="#32cd32" size="medium" text="loading" />
      </center>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        👥 User List
      </h3>

      <div style={{ overflowX: "auto" }}>
        <table
          width="100%"
          style={{
            borderCollapse: "collapse",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ background: "#4a90e2", color: "#fff" }}>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Password</th>
              <th style={th}>Role</th>
              <th style={th}>Function</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    scale: 1.01,
                    backgroundColor: "#f5f7fa",
                  }}
                  style={{
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                  }}
                >
                  <td style={td}>{item.name}</td>
                  <td style={td}>{item.email}</td>
                  <td style={td}>{item.password}</td>
                  <td style={td}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        background:
                          item.role === "admin"
                            ? "#ff4d4f"
                            : "#52c41a",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    >
                      {item.role}
                    </span>
                  </td>
                  <td style={td}>{item.function_name}</td>
                  <td style={td}>{item.status}</td>
                  <td style={td}>
                    <button
                      onClick={() => handleEdit(item.id)}
                      style={editBtn}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      style={deleteBtn}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}
    </div>
  );
};

// 🎨 Styles
const th = {
  padding: "12px",
  textAlign: "center",
  fontSize: "14px",
};

const td = {
  padding: "12px",
  textAlign: "center",
};

const editBtn = {
  marginRight: "10px",
  padding: "6px 12px",
  border: "none",
  borderRadius: "5px",
  background: "#1890ff",
  color: "#fff",
  cursor: "pointer",
};

const deleteBtn = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "5px",
  background: "#ff4d4f",
  color: "#fff",
  cursor: "pointer",
};
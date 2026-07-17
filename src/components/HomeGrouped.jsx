import React from "react";
import ReactPaginate from "react-paginate";

export const HomeGrouped = ({
  grouped,
  userFunction,
  thStyle,
  tdStyle,
  tdTotalStyle,
  pageCount,
  handlePageClick,
}) => {
  return (
    <div style={{ maxWidth: "100%", width: "100%", padding: "10px" }}>
      {Object.entries(grouped).length === 0 ? (
        <p style={{ textAlign: "center", color: "red", fontSize: "18px" }}>
          No records found for your Function Name: <b>{userFunction}</b>
        </p>
      ) : (
        Object.entries(grouped).map(([name, items]) => (
          <div
            key={name}
            style={{
              marginBottom: "30px",
              border: "1px solid #aaa",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "#0275d8",
                color: "white",
                padding: "10px 15px",
                fontSize: "18px",
              }}
            >
              {name}
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                width="100%"
                border="1"
                style={{
                  borderCollapse: "collapse",
                  minWidth: "1200px",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f1f1f1" }}>
                    <th style={thStyle}>ஊர்</th>
                    <th style={thStyle}>பழைய பணம்</th>
                    <th style={thStyle}>புதிய பணம்</th>
                    <th style={thStyle}>தடவை</th>
                    <th style={thStyle}>திருமண விழா</th>
                    <th style={thStyle}>நிலை</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f7d4e7" : "#e2e2e2",
                      }}
                    >
                      <td style={tdStyle}>{item.place}</td>
                      <td style={tdStyle}>{item.old_amount}</td>
                      <td style={tdStyle}>{item.new_amount}</td>
                      <td style={tdStyle}>{item.given_amount_status}</td>
                      <td style={tdStyle}>{item.function_name}</td>
                      <td
                        style={{
                          ...tdStyle,
                          color:
                            item.status === "Pending" ? "green" : "red",
                        }}
                      >
                        {item.status === "Pending"
                          ? "நிலுவையில் உள்ளது"
                          : "நிறைவு"}
                      </td>
                    </tr>
                  ))}

                  <tr
                    style={{
                      backgroundColor: "#dff0d8",
                      fontWeight: "bold",
                    }}
                  >
                    <td></td>
                    <td></td>
                    <td style={tdTotalStyle}>
                      மொத்தம்:{" "}
                      {items.reduce(
                        (total, item) =>
                          total + Number(item.new_amount || 0),
                        0
                      )}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ReactPaginate
              previousLabel="Previous"
              nextLabel="Next"
              breakLabel="..."
              pageCount={pageCount}
              onPageChange={handlePageClick}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              containerClassName="pagination"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              activeClassName="active"
            />
          </div>
        ))
      )}
    </div>
  );
};
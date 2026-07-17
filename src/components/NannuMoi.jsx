import React from "react";
import { Commet } from "react-loading-indicators";
import { income_api } from "../utils/income-api";
import apiFetch from "./custom-hook/apiFetch";

export const NannuMoi = () => {
  const { products, error, isLoading } = apiFetch(() =>
    income_api.get("/mois?select=*"),
  );

  const total_amount = products.reduce(
    (sum, item) => sum + Number(item.new_amount || 0),
    0,
  );

 

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <Commet
          color="#d62560"
          size="large"
          text="loading..."
          textColor="#000"
        />
      </div>
    );
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h2>NannuMoi....</h2>



      <h1>Total - {total_amount}</h1>

      <h2>Count - {products.length}</h2>

     

      {products.map((item) => (
        <div key={item.id}>
          {item.place} - {item.name} - {item.new_amount}
        </div>
      ))}
    </div>
  );
};

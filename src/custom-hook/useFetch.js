import { useEffect, useState } from "react";
import { api } from "../utils/api";

const useFetch = (table) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/${table}`)
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setIsLoading(false);
      });
  }, [table]);

  return { products, error, isLoading, setProducts };
};

export default useFetch;
import { useEffect, useState } from "react";

function apiFetch(apiFunction) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await apiFunction();
        setProducts(response.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApi();
  }, [apiFunction]);

  return { products, error, isLoading, setProducts };
}

export default apiFetch;
// src/custom-hook/useFetch.js
import { useEffect, useState } from "react";

export default function useData(url, options = {}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let allData = [];
        let offset = 0;
        const limit = 1000;
        let hasMore = true;

        while (hasMore) {
          const res = await fetch(
            `${url}?limit=${limit}&offset=${offset}`,
            options
          );
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

          const json = await res.json();
          allData = [...allData, ...json];

          if (json.length < limit) {
            hasMore = false;
          } else {
            offset += limit;
          }
        }

        setData(allData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { products: data, isLoading, error, setProducts: setData };
}

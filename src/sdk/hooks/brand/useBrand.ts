import { useCallback, useEffect, useMemo, useState } from "react";
import { IBrand } from "../../../shared/interfaces/interface";

export const useBrand = () => {
  const [brandList, setBrandList] = useState<IBrand[]>();

  const [loading, setLoading] = useState<Boolean>(true);

  const getBrand = useCallback(
    async (filters: any) => {
      try {
        const queryParams = new URLSearchParams(filters);
        setLoading(true);
        const res = await fetch(
          `http://localhost:1337/api/brands?${queryParams}`
        );
        if (res.status === 200) {
          const response = await res.json();
          setBrandList(response?.data);
          setLoading(false);
          return response?.data;
        }
      } catch (err) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setBrandList]
  );

  return useMemo(
    () => ({
      getBrand,
      brandList,
      loading,
      setBrandList,
    }),
    [getBrand, brandList, loading, setBrandList]
  );
};

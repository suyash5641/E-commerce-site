import { useCallback, useEffect, useMemo, useState } from "react";
import { IBrand } from "../../../shared/interfaces/interface";
import { BASE_URL } from "../../../utils/constant/constant";

export const useBrand = () => {
  const [brandList, setBrandList] = useState<IBrand[]>();
  const [errorMessage,setErrorMessage]= useState<string>("");
  const [loading, setLoading] = useState<Boolean>(true);

  const getBrand = useCallback(
    async (filters: any) => {
      try {
        const queryParams = new URLSearchParams(filters);
        setLoading(true);
        const res = await fetch(`${BASE_URL}/brands?${queryParams}`);
        if (res.status === 200) {
          const response = await res.json();
          setBrandList(response?.data);
          setLoading(false);
          setErrorMessage("");
          return response?.data;
        } else if (res.status === 401) {
          setErrorMessage("Error Occured while fetching list of brands, try again");
        } else if (res.status === 500) {
          setErrorMessage("Error Occured while fetching list of brands, try again");
        }
      } catch (err) {
        setLoading(false);
        setErrorMessage("Error Occured while fetching list of brands, try again");
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setBrandList,setErrorMessage]
  );

  return useMemo(
    () => ({
      getBrand,
      brandList,
      loading,
      setBrandList,
      errorMessage,
      setErrorMessage,
    }),
    [getBrand, brandList, loading, setBrandList, errorMessage, setErrorMessage]
  );
};

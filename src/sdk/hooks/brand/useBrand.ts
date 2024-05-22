import { useCallback, useMemo, useState } from "react";
import { IBrand } from "../../../shared/interfaces/interface";
import { BASE_URL } from "../../../utils/constant/constant";

export const useBrand = () => {
  const [brandList, setBrandList] = useState<IBrand[]>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<Boolean>(true);

  const getBrand = useCallback(
    async (filters: any, signal: AbortSignal) => {
      try {
        const queryParams = new URLSearchParams(filters);
        setLoading(true);
        const res = await fetch(`${BASE_URL}/brands?${queryParams}`, {
          signal: signal,
        });
        if (res.status === 200) {
          const response = await res.json();
          setBrandList(response?.data);
          setLoading(false);
          setErrorMessage("");
          return response?.data;
        } else if (res.status === 401) {
          setErrorMessage("Error Occured try again");
        } else if (res.status === 500) {
          setErrorMessage("Error Occured try again");
        }
      } catch (err: any) {
        setLoading(false);
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setErrorMessage("Error Occured try again");
        }
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setBrandList, setErrorMessage]
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

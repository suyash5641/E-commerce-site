import { useCallback, useEffect, useMemo, useState } from "react";
import { IProductLists, ICategory } from "../../../shared/interfaces/interface";
import { BASE_URL } from "../../../utils/constant/constant";
// import { useSearchParams } from "react-router-dom";
import { categoryListData } from "../../../utils/data";

export const useProduct = () => {
  const [productList, setProductList] = useState<IProductLists[] | null>(null);
  const [categoryList, setCategoryList] = useState<ICategory[]>();
  const [loading, setLoading] = useState<Boolean>(true);
  const [productDetail, setProductDetail] = useState<IProductLists | null>(
    null
  );
  // const [searchParams,setSearchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const getProduct = useCallback(
    async (filters: any, signal?: AbortSignal) => {
      try {
        const queryParams = new URLSearchParams(filters);
        setLoading(true);
        const res = await fetch(`${BASE_URL}/products?${queryParams}`, {
          signal: signal,
        });
        if (res.status === 200) {
          const response = await res.json();
          setProductList(response?.data);
          return response?.data;
        } else if (res.status === 401) {
          setErrorMessage("Error Occured, try again");
        } else if (res.status === 500) {
          setErrorMessage("Error Occured, try again");
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setErrorMessage("Error Occured, try again");
        }
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setProductList, setErrorMessage]
  );

  const getCategories = useCallback(() => {
    setCategoryList(categoryListData);
  }, [setCategoryList]);

  const getProductDetail = useCallback(
    async (id: number) => {
      try {
        // setLoading(true);
        const res = await fetch(`${BASE_URL}/products/${id}?populate=*`);
        if (res.status === 200) {
          const response = await res.json();
          setProductDetail(response?.data);
        } else if (
          res.status === 401 ||
          res.status === 500 ||
          res.status === 404
        ) {
          setError("Error Occured, try again");
        }
      } catch (err) {
        setLoading(false);
        setError("Error Occured, try again");
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setProductDetail, setError]
  );

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(
    () => ({
      getProduct,
      getProductDetail,
      productDetail,
      productList,
      categoryList,
      loading,
      setProductList,
      errorMessage,
      setErrorMessage,
      setError,
      error,
    }),
    [
      getProduct,
      getProductDetail,
      productDetail,
      productList,
      categoryList,
      loading,
      setProductList,
      errorMessage,
      setErrorMessage,
      setError,
      error,
    ]
  );
};

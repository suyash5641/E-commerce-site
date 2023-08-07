import { useCallback, useEffect, useMemo, useState } from "react";
import { IProductLists, ICategory } from "../../../shared/interfaces/interface";

export const useProduct = () => {
  const [productList, setProductList] = useState<IProductLists[]>();
  const [categoryList, setCategoryList] = useState<ICategory[]>();
  const [loading, setLoading] = useState<Boolean>(true);
  const [productDetail, setProductDetail] = useState<IProductLists>();

  const getProduct = useCallback(async (filters: any) => {
    try {
      const queryParams = new URLSearchParams(filters);
      setLoading(true);
      const res = await fetch(
        `http://localhost:1337/api/products?${queryParams}`
      );
      if (res.status === 200) {
        const response = await res.json();
        setProductList(response?.data);
        setLoading(false);
        return response?.data;
      }
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [setLoading,setProductList]);

  const getCategories = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:1337/api/categories`);
      if (res.status === 200) {
        const response = await res.json();
        setCategoryList(response?.data);
      }
    } catch (err) {}
  }, [setCategoryList]);

  const getProductDetail = useCallback(async (id:number) => {
    try {
      // setLoading(true);
      const res = await fetch(
        `http://localhost:1337/api/products/${id}?populate=*`
      );
      if (res.status === 200) {
        const response = await res.json();
        setProductDetail(response?.data);
      }
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [setLoading,setProductDetail]);

  useEffect(() => {
    getCategories();
  }, []);

  return useMemo(
    () => ({
      getProduct,
      getProductDetail,
      productDetail,
      productList,
      categoryList,
      loading,
      setProductList
    }),
    [getProduct,  getProductDetail,productDetail,productList, categoryList, loading,setProductList]
  );
};

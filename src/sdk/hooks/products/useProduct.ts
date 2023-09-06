import { useCallback, useEffect, useMemo, useState } from "react";
import { IProductLists, ICategory } from "../../../shared/interfaces/interface";
import { BASE_URL } from "../../../utils/constant/constant";
import { useSearchParams } from "react-router-dom";
import { categoryListData } from "../../../utils/data";

export const useProduct = () => {
  const [productList, setProductList] = useState<IProductLists[]>();
  const [categoryList, setCategoryList] = useState<ICategory[]>();
  const [loading, setLoading] = useState<Boolean>(true);
  const [productDetail, setProductDetail] = useState<IProductLists>();
  const [searchParams,setSearchParams] = useSearchParams();

  const getProduct = useCallback(async (filters: any) => {
    try {
      const queryParams = new URLSearchParams(filters);
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/products?${queryParams}`
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

  const getCategories = useCallback( () => {
    setCategoryList(categoryListData);
  }, [setCategoryList]);

  const getProductDetail = useCallback(async (id:number) => {
    try {
      // setLoading(true);
      const res = await fetch(
        `${BASE_URL}/products/${id}?populate=*`
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
    if(searchParams.has('categoryid')){
      getCategories();
    }
  }, [searchParams]);
  
  

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

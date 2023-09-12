import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IProductLists,
  ICategory,
  IOrder,
} from "../../../shared/interfaces/interface";
import { BASE_URL } from "../../../utils/constant/constant";

export const useOrder = () => {
  const [orderList, setOrderList] = useState<IOrder[]>();
  //   const [categoryList, setCategoryList] = useState<ICategory[]>();
  const [loading, setLoading] = useState<Boolean>(true);
  const [orderDetail, setOrderDetail] = useState<IOrder>();
  const token = localStorage.getItem("authToken");

  const getOrder = useCallback(
    async (filters: any) => {
      try {
        const queryParams = new URLSearchParams(filters);
        setLoading(true);
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const res = await fetch(
          `${BASE_URL}/orders?${queryParams}`,
          requestOptions
        );
        if (res.status === 200) {
          const response = await res.json();
          setOrderList(response?.data);
          setLoading(false);
          return response?.data;
        }
        else if(res.status === 401 || res.status === 500){
           return ""
        }
      } catch (err) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setOrderList]
  );

  const updateOrderPaymentStatus = useCallback(
    async (status: boolean, filters: any) => {
      try 
      {
      let result = await getOrder(filters);
      if(result.length === 0){
        result = await getOrder(filters);
      }
      if(result[0]?.attributes?.paymentSucessful === status)
      return
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { paymentSucessful: status } }),
      };
      const res = await fetch(
        `${BASE_URL}/orders/${result[0]?.id}`,
        requestOptions
      );
      setLoading(false);
      }
      catch (err) {
        setLoading(false);
      }
    },
    [getOrder,setLoading]
  );

  const getOrderDetail = useCallback(
    async (id: number) => {
      try {
        // setLoading(true);
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const res = await fetch(
          `${BASE_URL}/orders/${id}?populate=*`,
          requestOptions
        );
        if (res.status === 200) {
          const response = await res.json();
          setOrderDetail(response?.data);
        }
      } catch (err) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setOrderDetail]
  );

  return useMemo(
    () => ({
      getOrder,
      getOrderDetail,
      orderDetail,
      orderList,
      loading,
      setOrderList,
      updateOrderPaymentStatus,
    }),
    [
      getOrder,
      getOrderDetail,
      orderDetail,
      orderList,
      loading,
      setOrderList,
      updateOrderPaymentStatus,
    ]
  );
};

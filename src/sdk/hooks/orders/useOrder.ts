import { useCallback, useMemo, useState } from "react";
import { IOrder } from "../../../shared/interfaces/interface";
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
        } else if (res.status === 401 || res.status === 500) {
          return "";
        }
      } catch (err) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setOrderList, token]
  );

  const updateOrderPaymentStatus = useCallback(
    async (status: boolean, filters: any, sessionId: string) => {
      try {
        let result = await getOrder(filters);
        if (result.length === 0) {
          result = await getOrder(filters);
        }
        const orderWithSessionId = result.filter(
          (order: IOrder) => order?.attributes?.stripeId === sessionId
        );
        console.log(
          orderWithSessionId,
          "test",
          orderWithSessionId[0]?.attributes?.paymentSucessful,
          orderWithSessionId[0]?.attributes?.paymentSucessful !== null
        );
        if (orderWithSessionId[0]?.attributes?.paymentSucessful !== null)
          return;
        const requestOptions = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: { paymentSucessful: status } }),
        };
        await fetch(`${BASE_URL}/orders/${result[0]?.id}`, requestOptions);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    },
    [getOrder, setLoading, token]
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
    [setLoading, setOrderDetail, token]
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

import { useCallback, useMemo, useState } from "react";
import { IOrder } from "../../../shared/interfaces/interface";
import { BASE_URL } from "../../../utils/constant/constant";

export const useOrder = () => {
  const [orderList, setOrderList] = useState<IOrder[] | null>(null);
  //   const [categoryList, setCategoryList] = useState<ICategory[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [orderDetail, setOrderDetail] = useState<IOrder>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const token = localStorage.getItem("authToken");

  const getOrder = useCallback(
    async (
      filters: any,
      maximumRetryAttempt: number = 1,
      attempts: number = 1
    ) => {
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
        const response = await res.json();
        if (res.status === 200) {
          setOrderList(response?.data);
          setLoading(false);
          return response?.data;
        } else if (res.status === 401 || res.status === 500) {
          throw response?.error?.message;
        }
      } catch (err) {
        if (attempts <= maximumRetryAttempt)
          getOrder(filters, maximumRetryAttempt, attempts + 1);
        else {
          setErrorMessage("Error Occured, try again");
          setLoading(false);
        }
      }
    },
    [setLoading, setOrderList, token]
  );

  const updateOrderPaymentStatus = useCallback(
    async (status: boolean, filters: any) => {
      try {
        const orderWithSessionId = await getOrder(filters);
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
        await fetch(
          `${BASE_URL}/orders/${orderWithSessionId[0]?.id}`,
          requestOptions
        );
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
      errorMessage,
      setErrorMessage,
    }),
    [
      getOrder,
      getOrderDetail,
      orderDetail,
      orderList,
      loading,
      setOrderList,
      updateOrderPaymentStatus,
      errorMessage,
      setErrorMessage,
    ]
  );
};

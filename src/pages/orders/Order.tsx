import { useOrder } from "../../sdk/hooks/orders/useOrder";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Stack, Typography } from "@mui/material";
import styles from "./order.module.scss";
export const Order = () => {
  const { getOrder, orderList, loading } = useOrder();

  useEffect(() => {
    getOrder({ populate: "*", "filters[paymentSucessful][$eq]": true });
  }, []);

  
  return (
    <>
      {loading ? (
        <></>
      ) : (
        <Stack direction={"column"}>
          <Stack>
            {orderList?.map((data, index) => (
              <Stack key={index} direction={"column"}>
                <Typography>Order placed on </Typography>
                {data?.attributes.products.map((val, pos) => (
                  <Stack direction={"row"} key={pos}>
                    <img
                      width={"100%"}
                      height={"100%"}
                      src={`http://localhost:1337${val?.attributes?.imageurl?.data?.attributes?.url}`}
                      alt="product"
                    />
                    <Typography>{val?.attributes?.name}</Typography>
                  </Stack>
                ))}
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </>
  );
};

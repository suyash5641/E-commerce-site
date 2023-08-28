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
        <Stack direction={"column"} className={styles.container} gap={"24px"}>
            {orderList?.map((data, index) => (
              <Stack key={index} direction={"column"} gap={"24px"}>
                <Typography textAlign={"center"}>Order placed on {String(new Date(data?.attributes?.createdAt).getUTCDate()).padStart(2, '0')}/{String(new Date(data?.attributes?.createdAt).getUTCMonth() + 1).padStart(2, '0')}/{new Date(data?.attributes?.createdAt).getUTCFullYear()}</Typography>
                {data?.attributes.products.map((val, pos) => (
                  <Stack direction={"row"} key={pos} gap={"24px"} alignItems={"center"}  className={styles.box}>
                    <img       
                      src={`http://localhost:1337${val?.attributes?.imageurl?.data?.attributes?.url}`}
                      alt="product"
                      className={styles.productimage}
                    />
                    <Stack className={styles.boxcontainer}>
                    <Typography className={styles.productname}>{val?.attributes?.name}</Typography>
                    <Typography className={styles.producttitle}>{val?.attributes?.title}</Typography>
                    <Typography className={styles.productprice} >Rs {val?.attributes?.discountedPrice}</Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            ))}
        </Stack>
      )}
    </>
  );
};

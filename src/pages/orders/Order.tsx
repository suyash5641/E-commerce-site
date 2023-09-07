import { useOrder } from "../../sdk/hooks/orders/useOrder";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";
import styles from "./order.module.scss";
import { Navbar } from "../../components/Navbar";
import { useAuth } from "../../sdk/context/AuthContext/AuthProvider";
import { nodatafound } from "../../assets";
export const Order = () => {
  const { getOrder, orderList, loading } = useOrder();
  const token = localStorage.getItem("authToken");
  const { fetchLoggedInUser, user } = useAuth();

  const getOrders = useCallback(async () => {
    if (token) {
      const userid = await fetchLoggedInUser(token);
      getOrder({
        populate: "*",
        "filters[paymentSucessful][$eq]": true,
        "filters[userId][$eq]": userid,
      });
    }
  }, [token, getOrder, fetchLoggedInUser]);

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      <Stack>
        <Stack className={styles.header}></Stack>
        <Navbar path="order" productTitle="" changeTopPosition={"0px"} />
        {loading ? (
          <Stack direction={"column"} className="loader">
           <CircularProgress/>
          </Stack>
         
        ) : (
          <Stack direction={"column"} className={styles.container} gap={"24px"}>
            {orderList && orderList.length > 0 ? (
              orderList?.map((data, index) => (
                <Stack key={index} direction={"column"} gap={"24px"}>
                  <Typography textAlign={"center"}>
                    Order placed on{" "}
                    {String(
                      new Date(data?.attributes?.createdAt).getUTCDate()
                    ).padStart(2, "0")}
                    /
                    {String(
                      new Date(data?.attributes?.createdAt).getUTCMonth() + 1
                    ).padStart(2, "0")}
                    /{new Date(data?.attributes?.createdAt).getUTCFullYear()}
                  </Typography>
                  {data?.attributes.products.map((val, pos) => (
                    <Stack
                      direction={"row"}
                      key={pos}
                      gap={"24px"}
                      alignItems={"center"}
                      className={styles.box}
                    >
                      <img
                        src={`${val?.attributes?.imageurl?.data?.attributes?.url}`}
                        alt="product"
                        className={styles.productimage}
                        width={"240px"}
                      />
                      <Stack className={styles.boxcontainer}>
                        <Typography className={styles.productname}>
                          {val?.attributes?.name}
                        </Typography>
                        <Typography className={styles.producttitle}>
                          {val?.attributes?.title}
                        </Typography>
                        <Typography className={styles.productprice}>
                          Rs {val?.attributes?.discountedPrice}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              ))
            ) : (
              <Stack alignItems="center" sx={{ width: "100%" }}>
                <img width="240px" src={nodatafound} />
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </>
  );
};

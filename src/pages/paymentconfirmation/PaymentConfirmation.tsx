import { Stack, Typography, Skeleton, Box, Button } from "@mui/material";
import styles from "./payment.module.scss";
import { useState, useEffect, useCallback } from "react";
// import { AES, enc } from "crypto-js";
import { useNavigate, useSearchParams } from "react-router-dom";
// import { useProduct } from "../../sdk/hooks/products/useProduct";
import { useCart } from "../../sdk/hooks/cartmanagement/useCart";
// import { IAttributes, Cart } from "../../shared/interfaces/interface";
// import { useAuth } from "../../sdk/context/AuthContext/AuthProvider";
import { useOrder } from "../../sdk/hooks/orders/useOrder";
import { sucess, failure } from "../../assets";

export const PaymentConfirmation = () => {
  const [paymentSuccessful, setPaymentSucessfull] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { emptyCart } = useCart();
  //   const { fetchLoggedInUser} = useAuth();
  const { updateOrderPaymentStatus } = useOrder();
  const sessionid = searchParams.get("session_id");

  const updateCart = useCallback(
    async (sessionid: string) => {
      try {
        const paymentStatus = searchParams.get("success");
        const removeCartItem = searchParams.get("cartflag");

        if (paymentStatus === "true") {
          setPaymentSucessfull(true);
          if (removeCartItem === "true") await emptyCart();
        } else {
          setPaymentSucessfull(false);
        }
        const filter = { populate: "*", "filters[stripeId][$eq]": sessionid };
        await updateOrderPaymentStatus(paymentStatus === "true", filter);
        setLoading(false);
      } catch (error) {
        throw error;
      }
    },
    [
      searchParams,
      updateOrderPaymentStatus,
      setLoading,
      emptyCart,
      setPaymentSucessfull,
    ]
  );

  useEffect(() => {
    if (sessionid) {
      updateCart(sessionid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionid]);

  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={"100vh"} />
      ) : (
        <Stack direction={"column"} className={styles.container}>
          <Box className={styles.box}>
            {paymentSuccessful ? (
              <>
                <img src={sucess} alt="success" className={styles.image} />
                <Typography variant="h1" textAlign={"center"}>
                  Payment Sucessful
                </Typography>
                <Stack direction={"row"} gap="24px">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/orders", { replace: true })}
                  >
                    Go to orders
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/", { replace: true })}
                  >
                    Go to home
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                <img src={failure} alt="failure" className={styles.image} />
                <Typography variant="h1" textAlign={"center"}>
                  Payment Failed
                </Typography>
                <Stack direction={"row"} gap="24px">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/cart", { replace: true })}
                  >
                    Go to cart
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/", { replace: true })}
                  >
                    Go to home
                  </Button>
                </Stack>
              </>
            )}
          </Box>
        </Stack>
      )}
    </>
  );
};

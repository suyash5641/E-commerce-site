import { Stack, Typography, Skeleton,Box, Button } from "@mui/material";
import styles from "./payment.module.scss";
import { useState, useEffect, useCallback } from "react";
import { AES, enc } from "crypto-js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProduct } from "../../sdk/hooks/products/useProduct";
import { useCart } from "../../sdk/hooks/cartmanagement/useCart";
import { IAttributes, Cart } from "../../shared/interfaces/interface";
import { useAuth } from "../../sdk/context/AuthContext/AuthProvider";
import { useOrder } from "../../sdk/hooks/orders/useOrder";
import { sucess,failure } from "../../assets";

export const PaymentConfirmation = () => {
  const [paymentSuccessful, setPaymentSucessfull] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { emptyCart } = useCart();
//   const { fetchLoggedInUser} = useAuth();
  const { updateOrderPaymentStatus } = useOrder();

  const updateCart = useCallback(async ( sessionid: string) => {
    const paymentStatus = searchParams.get("success");
    // const bytes = AES.decrypt(id, secret);
    // const decryptedText = bytes.toString(enc.Utf8);
    // setDecrypted(decryptedText);

    if (paymentStatus === "true") {
      setPaymentSucessfull(true);
      await emptyCart();
    } else {
      setPaymentSucessfull(false);
    }
    const filter = { populate: "*", "filters[stripeId][$eq]": sessionid };
    await updateOrderPaymentStatus(paymentStatus === "true", filter);
    setLoading(false);
  }, [searchParams,updateOrderPaymentStatus,setLoading,emptyCart,setPaymentSucessfull]);

  useEffect(() => {
    const sessionid = searchParams.get("session_id");
    if (sessionid) {
      updateCart(sessionid);
    }
  }, [searchParams]);


  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={"90vh"} />
      ) : (
        <Stack direction={"column"} className={styles.container}>
           <Box className={styles.box}>
           {paymentSuccessful ? (
            <>
            <img src={sucess} alt="success" className={styles.image}/>
            <Typography variant="h1" textAlign={"center"}>Payment Sucessful</Typography>
            <Stack direction={"row"} gap="24px">
            <Button variant="contained" color="secondary" onClick={()=>navigate('/orders',{ replace: true })}>Go to orders</Button>
            <Button variant="contained" color="secondary" onClick={()=>navigate('/',{ replace: true })}>Go to home</Button>
            </Stack>
            </>
          ) : (
            <>
             <img src={failure} alt="failure" className={styles.image}/>
            <Typography variant="h1" textAlign={"center"}>Payment Failed</Typography>
            <Stack direction={"row"} gap="24px">
            <Button variant="contained" color="secondary" onClick={()=>navigate('/cart',{ replace: true })}>Go to cart</Button>
            <Button variant="contained" color="secondary" onClick={()=>navigate('/',{ replace: true })}>Go to home</Button>
            </Stack>
            </>
          )} 
          </Box>
        </Stack>
      )}
    </>
  );
};

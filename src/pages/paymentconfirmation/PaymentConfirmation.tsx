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
// interface Cart {
//     id: number;
//     attributes: IAttributes;
//   }

export const PaymentConfirmation = () => {
  const [paymentSuccessful, setPaymentSucessfull] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
//   const [secret, setSecret] = useState("32#@JWuytyykeyPROD##D");
//   const [cipher, setCipher] = useState("");
//   const [decrypted, setDecrypted] = useState("");
  //   const { getProduct} = useProduct();
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
            <Typography variant="h1" textAlign={"center"}>Payment Sucess</Typography>
            <Button variant="contained" color="primary">Go to orders</Button>
            </>
          ) : (
            <>
             <img src={failure} alt="failure" className={styles.image}/>
            <Typography variant="h1" textAlign={"center"}>Payment Failed</Typography>
            <Button variant="contained" color="primary" onClick={()=>navigate('/cart')}>Go to cart</Button>
            </>
          )} 
          </Box>
        </Stack>
      )}
    </>
  );
};

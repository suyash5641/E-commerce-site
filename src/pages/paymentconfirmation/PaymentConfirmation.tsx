import { Stack, Typography, Skeleton } from "@mui/material";
import styles from "./payment.module.scss";
import { useState, useEffect, useCallback } from "react";
import { AES, enc } from "crypto-js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProduct } from "../../sdk/hooks/products/useProduct";
import { useCart } from "../../sdk/hooks/cartmanagement/useCart";
import { IAttributes, Cart } from "../../shared/interfaces/interface";
import { useAuth } from "../../sdk/context/AuthContext/AuthProvider";
import { useOrder } from "../../sdk/hooks/orders/useOrder";
// interface Cart {
//     id: number;
//     attributes: IAttributes;
//   }

export const PaymentConfirmation = () => {
  const [paymentSuccessful, setPaymentSucessfull] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [secret, setSecret] = useState("32#@JWuytyykeyPROD##D");
  const [cipher, setCipher] = useState("");
  const [decrypted, setDecrypted] = useState("");
  //   const { getProduct} = useProduct();
  const { handleQuantityChange } = useCart();
  const { user } = useAuth();
  const {updateOrderPaymentStatus} = useOrder();

  const updateCart = useCallback(async (id: string,sid:string) => {
    const paymentStatus = searchParams.get("success");
    const bytes = AES.decrypt(id, secret);
    const decryptedText = bytes.toString(enc.Utf8);
    setDecrypted(decryptedText);
   
   
    if (paymentStatus === "true") {
      setPaymentSucessfull(true);
       decryptedText.split(",").forEach((value, index) => {
       const res = user?.cart?.find((data)=> data.id === parseInt(value));
       if(res)
       handleQuantityChange(res, true, "");
      });
    } else {
      setPaymentSucessfull(false);
    }
    const filter ={populate:"*","filters[stripeId][$eq]":sid}
    await updateOrderPaymentStatus(false,filter);
    setLoading(false);
  }, []);

  useEffect(() => {
    const id = searchParams.get("id");
    const sid = searchParams.get("session_id");
    console.log(id,sid,"iii")
    if (id && sid) {
      updateCart(id,sid);
    }
  }, [searchParams]);

//   console.log(loading, paymentSuccessful, "test", decrypted);

  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={"90vh"} />
      ) : (
        <Stack direction={"column"} className={styles.container}>
          {paymentSuccessful ? (
            <Typography>Payment Sucess</Typography>
          ) : (
            <Typography>Payment Failed</Typography>
          )}
        </Stack>
      )}
    </>
  );
};

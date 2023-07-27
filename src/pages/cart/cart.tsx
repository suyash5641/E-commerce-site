import { Box, Button, Stack, Typography,Skeleton } from "@mui/material";
import { useAuth } from "../../sdk/context/AuthContext/AuthProvider";
import styles from "./cart.module.scss";
import { useCart } from "../../sdk/hooks/cartmanagement/useCart";

export const Cart = () => {
  const { user } = useAuth();
  const {handleQuantityChange,cartdetailloading} = useCart();
  console.log(cartdetailloading);
  return (
    <>
    {cartdetailloading || user === null?
       (<Skeleton variant="rectangular" width={"100%"} height={"90vh"} />):
      (<Stack className={styles.cart}>
        <Stack flexDirection={"column"} className={styles.product}>
          {user?.cart?.map((data, index) => (
            <Stack className={styles.productcontainer} key={index}>
              <Stack className={styles.productimage}>
                <img
                  src={`http://localhost:1337${data?.attributes?.imageurl?.data?.attributes?.url}`}
                  alt="product"
                />
              </Stack>
              <Stack className={styles.productinfo}>
                <Typography variant="h2">{data?.attributes?.title}</Typography>
                <Typography variant="h2" className={styles.discountedPrice}>
                  {data?.attributes?.discountedPrice}
                </Typography>
                <Stack direction={"row"} gap={"24px"}>
                  <Typography variant="h5" className={styles.price}>
                    {data?.attributes?.price}
                  </Typography>
                  <Typography variant="h5" className={styles.discountPercent}>
                    {data?.attributes?.discountPercent}
                    {" off"}
                  </Typography>
                </Stack>
                <Stack direction={"row"} justifyContent={"flex-start"} gap="16px">
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={data?.quantity === 1}
                      onClick={()=>handleQuantityChange(data?.id,false,data?.quantity-1)}
                    >
                      -
                    </Button>
                    <Typography variant="h5" sx={{margin:'auto 0'}}>
                    {data?.quantity}
                  </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={()=>handleQuantityChange(data?.id,false,data?.quantity+1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={()=>handleQuantityChange(data?.id,true,0)}
              
                    >Remove from cart</Button>
                  </Stack>
              </Stack>
            </Stack>
          ))}
        </Stack>
        <Stack flexDirection={"column"} className={styles.checkoutbox}>
        <Typography variant="h5">Price details</Typography>
          <Stack flexDirection={"row"}>
            <Typography variant="h5">Price {user?.cart?.length} items</Typography>
            <Typography variant="h5">11</Typography>
          </Stack>
          <Stack flexDirection={"row"}>
            <Typography variant="h5">Discount</Typography>
            <Typography variant="h5">11</Typography>
          </Stack>
          <Stack flexDirection={"row"}>
            <Typography variant="h5">Total amount</Typography>
            <Typography variant="h5">11</Typography>
          </Stack>
        </Stack>
      </Stack>)}
    </>
  );
};

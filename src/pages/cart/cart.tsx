import {
  Box,
  Button,
  Stack,
  Typography,
  Skeleton,
  Divider,
} from "@mui/material";
import { useAuth } from "../../sdk/context/AuthContext/AuthProvider";
import styles from "./cart.module.scss";
import { useCart } from "../../sdk/hooks/cartmanagement/useCart";
import { loadStripe } from "@stripe/stripe-js";

export const Cart = () => {
  const token = localStorage.getItem("authToken");
  const { user } = useAuth();
  const { handleQuantityChange, cartdetailloading } = useCart();
  // console.log(
  //   cartdetailloading,
  //   user,
  //   "che",
  //   cartdetailloading || user === null
  // );

  const stripePromise = loadStripe(
    "pk_test_51NZCukSEFvyokD6c4VjZ43S6AOQuCKGdHtQBwVZrg6fbCbstRL3LxuspjkhqwgYS9dBmA6p0FmDJshWnzsMAjkVs00k7Ic4tCK"
  );

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: user?.cart,
        }),
      };
      const res = await fetch(
        `http://localhost:1337/api/orders`,
        requestOptions
      );
      const data = await res.json();
      await stripe?.redirectToCheckout({
        sessionId: data?.stripeSession.id,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {cartdetailloading || user === null ? (
        <Skeleton variant="rectangular" width={"100%"} height={"90vh"} />
      ) : user?.cart?.length > 0 ? (
        <Stack className={styles.cart}>
          <Stack flexDirection={"column"} className={styles.product}>
            {user?.cart?.map((data, index) => (
              <Stack className={styles.productcontainer} key={index}>
                <Stack className={styles.productimage}>
                  <img
                    width={"180px"}
                    src={`http://localhost:1337${data?.attributes?.imageurl?.data?.attributes?.url}`}
                    alt="product"
                  />
                </Stack>
                <Stack className={styles.productinfo}>
                  <Typography variant="h2">
                    {data?.attributes?.title}
                  </Typography>
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
                  <Stack
                    direction={"row"}
                    justifyContent={"flex-start"}
                    gap="16px"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={data?.quantity === 1}
                      onClick={() => handleQuantityChange(data, false, "dec")}
                    >
                      -
                    </Button>
                    <Typography variant="h5" sx={{ margin: "auto 0" }}>
                      {data?.quantity}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleQuantityChange(data, false, "inc")}
                    >
                      +
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleQuantityChange(data, true, "")}
                    >
                      Remove from cart
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Stack>
          <Stack flexDirection={"column"} className={styles.checkoutbox}>
            <Typography variant="h2">Price details</Typography>
            <Stack flexDirection={"row"} justifyContent={"space-between"}>
              <Typography className={styles.title}>
                Price ({user?.cart?.length} item)
              </Typography>
              <Typography className={styles.subtitle}>
                Rs {user?.cartTotalPrice}
              </Typography>
            </Stack>
            <Stack flexDirection={"row"} justifyContent={"space-between"}>
              <Typography className={styles.title}>Discount</Typography>
              <Typography
                className={styles.subtitle}
                sx={{ color: "#198b1e !important" }}
              >
                -Rs {user?.discountPrice}
              </Typography>
            </Stack>
            <Divider />
            <Stack flexDirection={"row"} justifyContent={"space-between"}>
              <Typography className={styles.title}>Total amount</Typography>
              <Typography className={styles.subtitle}>
                Rs {user?.cartActualPrice}
              </Typography>
            </Stack>
            <Divider />
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              className={styles.savingtext}
            >
              <Typography>Total savings</Typography>
              <Typography>Rs {user?.discountPrice}</Typography>
            </Stack>
            <Button onClick={handlePayment}>Checkout</Button>
          </Stack>
        </Stack>
      ) : (
        <Stack></Stack>
      )}
    </>
  );
};

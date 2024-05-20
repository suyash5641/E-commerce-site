import {
  Button,
  Stack,
  Typography,
  Skeleton,
  Divider,
  Alert,
} from "@mui/material";
import { useAuth } from "../../sdk/context/AuthContext/AuthProvider";
import styles from "./cart.module.scss";
import { useCart } from "../../sdk/hooks/cartmanagement/useCart";
// import { loadStripe } from "@stripe/stripe-js";
// import { BASE_URL, stripe_key } from "../../utils/constant/constant";
import { Navbar } from "../../components/Navbar";
import DeleteIcon from "@mui/icons-material/Delete";
import { emptycart } from "../../assets";

export const Cart = () => {
  // const token = localStorage.getItem("authToken");
  const { user } = useAuth();
  const {
    handleQuantityChange,
    cartdetailloading,
    errorMessage,
    setErrorMessage,
    handleCheckout,
  } = useCart();

  return (
    <>
      {cartdetailloading || user === null ? (
        <Skeleton variant="rectangular" width={"100%"} height={"90vh"} />
      ) : user?.cart?.length > 0 ? (
        <>
          <Navbar path="cart" productTitle={""} changeTopPosition={"40px"} />
          {errorMessage && errorMessage.length > 0 && (
            <Stack alignItems="center" sx={{ width: "100%" }} spacing={2}>
              <Alert
                className="errornotification"
                severity={"error"}
                onClose={() => {
                  setErrorMessage("");
                }}
              >
                {errorMessage}
              </Alert>
            </Stack>
          )}
          <Stack className={styles.cart}>
            <Stack flexDirection={"column"} className={styles.product}>
              {user?.cart?.map((data, index) => (
                <Stack className={styles.productcontainer} key={index}>
                  <Stack className={styles.productimage}>
                    <img
                      width={"180px"}
                      src={`${data?.attributes?.imageurl?.data?.attributes?.url}`}
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
                      <Typography
                        variant="h5"
                        className={styles.discountPercent}
                      >
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
                        <DeleteIcon sx={{ color: "#fff" }} />
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              ))}
            </Stack>
            <Stack flexDirection={"column"} className={styles.checkoutbox}>
              <Typography variant="h2" textAlign={"center"}>
                Price details
              </Typography>
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
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </Stack>
          </Stack>
        </>
      ) : (
        <>
          <Navbar path="cart" productTitle={""} changeTopPosition={"40px"} />
          <Stack alignItems={"center"}>
            <img
              src={emptycart}
              className="imagecart"
              width={"45%"}
              height={"45%"}
              alt="empty cart"
            />
          </Stack>
        </>
      )}
    </>
  );
};

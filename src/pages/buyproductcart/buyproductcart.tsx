import {
  Box,
  Button,
  Stack,
  Typography,
  Skeleton,
  Divider,
  IconButton,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../sdk/context/AuthContext/AuthProvider";
import styles from "./cart.module.scss";
import { useCart } from "../../sdk/hooks/cartmanagement/useCart";
import { loadStripe } from "@stripe/stripe-js";
import { BASE_URL, stripe_key } from "../../utils/constant/constant";
import { Navbar } from "../../components/Navbar";
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useProduct } from "../../sdk/hooks/products/useProduct";
import { emptycart } from "../../assets";

export const BuyProductCart = () => {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const location = useLocation();
  const {getProductDetail,productDetail,loading} = useProduct();
  const [searchParams, setSearchParams] = useSearchParams();
  const [productQuantity,setProductQuantity] = useState<number>(1);
  const [isLogin, setIsLogin] = useState(false);
  const idParam = searchParams.get("id");
  const { user } = useAuth();
  const handleQuantityChange = useCallback((key:string)=>{
    if(key === "inc"){
      setProductQuantity((prev)=>prev+1);
    }
    else if(key ==="dec"){
      setProductQuantity((prev)=>prev-1);
    }
    else {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete("id");
      navigate({
        pathname: location.pathname,
        search: `?${searchParams.toString()}`,
      });
    }
  },[setProductQuantity,navigate,location]);
  // const { handleQuantityChange, cartdetailloading } = useCart();
  
  const handlePayment = async () => {
    try {
      const stripePromise = loadStripe(stripe_key);
      const stripe = await stripePromise;
      const payload = {
          ...productDetail,
          quantity:productQuantity
      }
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
       
        body: JSON.stringify({
          products: [payload],
        }),
      };
      const res = await fetch(
        `${BASE_URL}/orders`,
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

  useEffect(() => {
    if (searchParams.has("id") && idParam != null) {
      getProductDetail(parseInt(idParam));
    }
  }, [searchParams, getProductDetail]);

  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={"90vh"} />
      ) : searchParams.has("id") && productDetail? (
        <>
         <Navbar path="buynow" productTitle={''} changeTopPosition={"40px"} />
        <Stack className={styles.cart}>
          <Stack flexDirection={"column"} className={styles.product}>
              <Stack className={styles.productcontainer}>
                <Stack className={styles.productimage}>
                  <img
                    width={"180px"}
                    src={`${productDetail?.attributes?.imageurl?.data?.attributes?.url}`}
                    alt="product"
                  />
                </Stack>
                <Stack className={styles.productinfo}>
                  <Typography variant="h2">
                    {productDetail?.attributes?.title}
                  </Typography>
                  <Typography variant="h2" className={styles.discountedPrice}>
                    {productDetail?.attributes?.discountedPrice}
                  </Typography>
                  <Stack direction={"row"} gap={"24px"}>
                    <Typography variant="h5" className={styles.price}>
                      {productDetail?.attributes?.price}
                    </Typography>
                    <Typography variant="h5" className={styles.discountPercent}>
                      {productDetail?.attributes?.discountPercent}
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
                      disabled={productQuantity === 1}
                      onClick={() => handleQuantityChange("dec")}
                    >
                      -
                    </Button>
                    <Typography variant="h5" sx={{ margin: "auto 0" }}>
                      {productQuantity}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleQuantityChange("inc")}
                    >
                      +
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleQuantityChange("del")}
                    >
                      <DeleteIcon sx={{ color: '#fff' }} />
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            
          </Stack>
          <Stack flexDirection={"column"} className={styles.checkoutbox}>
            <Typography variant="h2" textAlign={"center"}>Price details</Typography>
            <Stack flexDirection={"row"} justifyContent={"space-between"}>
              <Typography className={styles.title}>
                Price ({productQuantity} item)
              </Typography>
              <Typography className={styles.subtitle}>
                Rs {parseInt(productDetail?.attributes?.price)*productQuantity}
              </Typography>
            </Stack>
            <Stack flexDirection={"row"} justifyContent={"space-between"}>
              <Typography className={styles.title}>Discount</Typography>
              <Typography
                className={styles.subtitle}
                sx={{ color: "#198b1e !important" }}
              >
                -Rs {productQuantity*(parseInt(productDetail?.attributes?.price) - parseInt(productDetail?.attributes?.discountedPrice))}
              </Typography>
            </Stack>
            <Divider />
            <Stack flexDirection={"row"} justifyContent={"space-between"}>
              <Typography className={styles.title}>Total amount</Typography>
              <Typography className={styles.subtitle}>
                Rs {productQuantity*parseInt(productDetail?.attributes?.discountedPrice)}
              </Typography>
            </Stack>
            <Divider />
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              className={styles.savingtext}
            >
              <Typography>Total savings</Typography>
              <Typography>Rs {productQuantity*(parseInt(productDetail?.attributes?.price) - parseInt(productDetail?.attributes?.discountedPrice))}</Typography>
            </Stack>
            <Button variant="contained" color="secondary" onClick={handlePayment}>Checkout</Button>
          </Stack>
        </Stack>
        </>
      ) : (
        <>
        <Navbar path="buynow" productTitle={''} changeTopPosition={"40px"} />
        <Stack alignItems={"center"}>
         <img src={emptycart} className="imagecart" width={"45%"} height={"45%"}/>
         </Stack>
        </>
      )}
    </>
  );
};

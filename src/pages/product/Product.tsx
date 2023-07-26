import { useEffect, useCallback, useState } from "react";
import { useProduct } from "../../sdk/hooks/products/useProduct";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Stack,
  Typography,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import styles from "./product.module.scss";
import { useCart } from "../../sdk/hooks/cartmanagement/useCart";
import { useAuth } from "../../sdk/context/AuthContext/AuthProvider";

export const Product = () => {
  const { getProductDetail, productDetail, loading } = useProduct();
  const { updateCart } = useCart();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  // const [isCartButtonLabel,setCartButtonLabel] = useState<boolean | null>(null);
  // const [loading,setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const idParam = searchParams.get("id");
  const [cartButtonLabel, setCartButtonLabel] = useState("");

  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  useEffect(() => {
    if (searchParams.has("id") && idParam != null) {
      getProductDetail(parseInt(idParam));
    }
  }, [searchParams, getProductDetail]);

  const addQueryParam = useCallback(
    (key: string, value: string) => {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.append(key, value);
      navigate({ search: `?${searchParams.toString()}` });
    },
    [window.location?.search, navigate]
  );

  const handleCartButtonClick = useCallback(async () => {
    if (cartButtonLabel === "Add to Cart") {
      if (searchParams.has("id") && idParam != null && isLogin) {
        await updateCart(parseInt(idParam));
      } else {
        addQueryParam("login", "true");
      }
    }
    else{
         navigate("/cart");
    }
  }, [isLogin, searchParams, updateCart, idParam,cartButtonLabel]);


  useEffect(() => {
    if (loading) return;
    if (token && user != null) {
      const findItem = user?.cart?.find(
        (item) => item.id === productDetail?.id
      );
      if (findItem) {
        setCartButtonLabel("Go to Cart"); // Product is in the cart
      } else {
        setCartButtonLabel("Add to Cart"); // Product is not in the cart
      }
      setIsLogin(true);
    } else if (token === null) {
      setCartButtonLabel("Add to Cart"); // User is not logged in
      setIsLogin(false);
    }
  }, [user, productDetail, setCartButtonLabel, token, loading]);

  // useEffect(() => {
  //   console.log(user,"testttt")
  //   if(user){
  //     const findItem = user?.cart?.find((item) => item.id === productDetail?.id)
  //     if(findItem){
  //       setCartButtonLabel(true)
  //     }
  //     else{
  //       setCartButtonLabel(false)
  //     }
  //     setIsLogin(true);
  //   }
  //   else{
  //     setIsLogin(false);
  //     setCartButtonLabel(false);
  //   }
  // }, [user,setCartButtonLabel,setIsLogin,productDetail]);

  // console.log("getpro", isCartButtonLabel!=null,  !isCartButtonLabel,isCartButtonLabel,user ,isLogin )
  //  console.log(cartButtonLabel,"label",user,loading)
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={"90vh"} />
      ) : (
        <Stack direction="column">
          <Stack className={styles.productcontainer}>
            <Stack className={styles.productimage}>
              <img
                src={`http://localhost:1337${productDetail?.attributes?.imageurl?.data?.attributes?.url}`}
                alt="product"
              />
            </Stack>
            <Stack className={styles.productinfo}>
              {/* <Typography variant="h3">{productDetail?.attributes?.brandName}</Typography> */}
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
              {
                <Button
                  disabled={cartButtonLabel.length === 0}
                  sx={{ width: "fit-content" }}
                  variant="contained"
                  color="primary"
                  onClick={handleCartButtonClick}
                >
                  {cartButtonLabel}
                </Button>
              }
            </Stack>
          </Stack>
        </Stack>
      )}
    </>
  );
};
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
import { Navbar } from "../../components/Navbar";

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
      // navigate({ search: `?${searchParams.toString()}` });
      navigate({
        pathname: window.location.pathname,
        search: `?${searchParams.toString()}`,
      });
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

  const handleBuyButtonClick = useCallback(async () => {
   
      if (searchParams.has("id") && idParam != null && isLogin) {
        navigate(`/buyproduct?id=${idParam}`);
      } else {
        addQueryParam("login", "true");
      }
  }, [isLogin, searchParams, idParam]);


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

  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={"90vh"} />
      ) : (
        <>
        <Navbar path="product" productTitle={productDetail?.attributes?.name ?? ''} changeTopPosition={"40px"} />
        <Stack direction="column">
          <Stack className={styles.productcontainer}>
            <Stack className={styles.productimage}>
              <img
                src={`${productDetail?.attributes?.imageurl?.data?.attributes?.url}`}
                height={"95%"}
                width={"95%"}
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
              <Stack  gap={"8px"} sx={{margin:"12px 0px"}}>
                <Typography variant="h3" >
                  About Item
                </Typography>
                <Typography variant="h5" >
                  {productDetail?.attributes?.description}
                 
                </Typography>
              </Stack>
              <Stack direction={"row"} gap={"32px"}>
              <Button
                  sx={{ width: "fit-content" }}
                  variant="contained"
                  color="primary"
                  onClick={handleBuyButtonClick}
                >
                  Buy now
                </Button>
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
        </Stack>
        </>
      )}
    </>
  );
};

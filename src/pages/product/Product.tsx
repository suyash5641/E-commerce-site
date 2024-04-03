import { useEffect, useCallback, useState } from "react";
import { useProduct } from "../../sdk/hooks/products/useProduct";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Stack, Typography, Skeleton, Alert } from "@mui/material";
import styles from "./product.module.scss";
import { useCart } from "../../sdk/hooks/cartmanagement/useCart";
import { useAuth } from "../../sdk/context/AuthContext/AuthProvider";
import { Navbar } from "../../components/Navbar";

export const Product = () => {
  const { getProductDetail, productDetail, loading } = useProduct();
  const { updateCart, errorMessage, setErrorMessage, loadingCart } = useCart();
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
  }, [idParam]);

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
    [navigate]
  );

  const handleCartButtonClick = useCallback(async () => {
    if (cartButtonLabel === "Add to Cart") {
      if (searchParams.has("id") && idParam != null && isLogin) {
        await updateCart(parseInt(idParam));
      } else {
        addQueryParam("login", "true");
      }
    } else {
      navigate("/cart");
    }
  }, [
    isLogin,
    updateCart,
    idParam,
    cartButtonLabel,
    addQueryParam,
    navigate,
    searchParams,
  ]);

  const handleBuyButtonClick = useCallback(async () => {
    if (searchParams.has("id") && idParam != null && isLogin) {
      navigate(`/buyproduct?id=${idParam}`);
    } else {
      addQueryParam("login", "true");
    }
  }, [isLogin, addQueryParam, idParam, navigate, searchParams]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, loading]);

  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={"99vh"} />
      ) : (
        <>
          <Navbar
            path="product"
            productTitle={productDetail?.attributes?.name ?? ""}
            changeTopPosition={"40px"}
          />
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
                <Typography variant="h2" className={styles.productTitle}>
                  {productDetail?.attributes?.title}
                </Typography>
                <Typography variant="h2" className={styles.discountedPrice}>
                  Rs {productDetail?.attributes?.discountedPrice}
                </Typography>
                <Stack direction={"row"} gap={"24px"}>
                  <Typography variant="h5" className={styles.price}>
                    Rs {productDetail?.attributes?.price}
                  </Typography>
                  <Typography variant="h5" className={styles.discountPercent}>
                    {productDetail?.attributes?.discountPercent}
                    {" off"}
                  </Typography>
                </Stack>
                <Stack gap={"8px"} sx={{ margin: "12px 0px" }}>
                  <Typography variant="h3">About Item</Typography>
                  {/* <Typography variant="h5" >
                  {productDetail?.attributes?.description}
                 
                </Typography> */}
                  {productDetail?.attributes?.description
                    .split("##")
                    .map((data, index) => (
                      <li key={index}>{data}</li>
                    ))}
                </Stack>
                <Stack
                  direction={"row"}
                  gap={"32px"}
                  sx={{ margin: "16px 0px" }}
                >
                  <Button
                    sx={{ width: "fit-content" }}
                    variant="contained"
                    color="secondary"
                    onClick={handleBuyButtonClick}
                    className={styles.button}
                  >
                    Buy now
                  </Button>
                  {
                    <Button
                      disabled={
                        cartButtonLabel === "Go to Cart"
                          ? false
                          : loadingCart === false
                          ? false
                          : true
                      }
                      sx={{ width: "fit-content" }}
                      variant="contained"
                      color="secondary"
                      onClick={handleCartButtonClick}
                      className={styles.button}
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

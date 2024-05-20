import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import styles from "./header.module.scss";
import { Outlet } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginModal, SignUpModal } from "../../shared/components/Modal";
import { useAuth } from "../../sdk/context/AuthContext/AuthProvider";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { UserProfile } from "../UserProfile";

export const Header = () => {
  const navigate = useNavigate();
  const { fetchLoggedInUser, user } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [show, setIsShow] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  let url = new URL(window.location.href);
  // let searchParams = new URLSearchParams(url.search);
  let searchParams = useMemo(() => {
    return new URLSearchParams(url.search);
  }, [url.search]);

  const addQueryParam = useCallback(
    (key: string, value: string) => {
      // const currentURL = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set(key, value);

      navigate({
        pathname: window.location.pathname,
        search: `?${urlParams.toString()}`,
      });
    },
    [navigate]
  );

  const removeQueryParam = useCallback(
    (key: string) => {
      searchParams.delete(key);
      navigate({
        pathname: location.pathname,
        search: `?${searchParams.toString()}`,
      });
      // navigate({ search: `?${searchParams.toString()}` });
    },
    [location.pathname, navigate, searchParams]
  );

  const handleModalOpen = useCallback(
    (params: string) => {
      addQueryParam(params, "true");
      if (searchParams.has(params === "login" ? "signup" : "login")) {
        removeQueryParam(params === "login" ? "signup" : "login");
      }
    },
    [addQueryParam, removeQueryParam, searchParams]
  );

  const handleProductCartOpen = useCallback(() => {
    if (isLogin) {
      navigate("/cart");
    } else {
      handleModalOpen("login");
    }
  }, [handleModalOpen, isLogin, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      setIsShow(false);
      if (token) {
        try {
          const res = await fetchLoggedInUser(token);
          if (res) {
            setIsLogin(true);
            setIsShow(true);
          } else {
            setIsLogin(false);
            setIsShow(true);
          }
        } catch (error) {}
      } else {
        setIsLogin(false);
        setIsShow(true);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      {false ? (
        // <Skeleton variant="rectangular" width={"100%"} className={styles.header}/>
        <Stack />
      ) : (
        <Stack
          className={styles.header}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          {isLogin ? (
            <>
              <Button
                onClick={() => navigate("/productlist")}
                className={styles.text}
              >
                Shop Now
              </Button>
              <Stack flexDirection={"row"} gap={"24px"} alignItems={"center"}>
                {location.pathname !== "/cart" && (
                  <IconButton
                    onClick={handleProductCartOpen}
                    sx={{ color: "#fff" }}
                  >
                    <AddShoppingCartIcon />
                    {user?.cart && (
                      <Box className={styles.cartproductcount}>
                        <Typography className={styles.cartproductcounttext}>
                          {user?.cart.length}
                        </Typography>
                      </Box>
                    )}
                  </IconButton>
                )}
                <UserProfile />
              </Stack>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate("/productlist")}
                className={styles.text}
              >
                Shop Now
              </Button>
              <Stack
                className={styles.section}
                flexDirection={"row"}
                alignItems={"center"}
              >
                <Button
                  onClick={() => handleModalOpen("login")}
                  className={styles.loginText}
                >
                  Login
                </Button>
                <Button
                  onClick={() => handleModalOpen("signup")}
                  className={styles.loginText}
                >
                  Signup
                </Button>
                <IconButton
                  onClick={handleProductCartOpen}
                  sx={{ color: "#fff" }}
                >
                  <AddShoppingCartIcon />
                </IconButton>
              </Stack>
            </>
          )}
        </Stack>
      )}
      <Outlet />
      <LoginModal />
      <SignUpModal />
      {/* <ForgotPasswordModal/> */}
    </>
  );
};

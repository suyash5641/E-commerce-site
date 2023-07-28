import { Box, Button, Skeleton, Stack } from "@mui/material";
import styles from "./header.module.scss";
import { Outlet, useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginModal, SignUpModal } from "../../shared/components/Modal";
import { useAuth } from "../../sdk/context/AuthContext/AuthProvider";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { UserProfile } from "../UserProfile";

export const Header = () => {
  const navigate = useNavigate();
  const { fetchLoggedInUser } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [show, setIsShow] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  let url = new URL(window.location.href);
  let searchParams = new URLSearchParams(url.search);
  const addQueryParam = useCallback((key: string, value: string) => {

    // searchParams.append(key, value);
    // const updatedSearchString = `?${searchParams.toString()}`;
    // console.log(updatedSearchString,searchParams,"test",window.location.href,window.location.pathname)
    // navigate({
    //   pathname: window.location.pathname,
    //   search: `?${searchParams.toString()}`,
    // });
    // navigate({ search: `?${searchParams.toString()}` });
    const currentURL = window.location.href;
    const urlParams = new URLSearchParams(window.location.search); 
    urlParams.set(key, value);
    // const updatedURL = `${currentURL.split('?')[0]}?${urlParams.toString()}`;
    // console.log(updatedURL,"up",`?${urlParams.toString()}`)
    navigate({
      pathname: window.location.pathname,
      search: `?${urlParams.toString()}`,
    });
  },[navigate]);

  const removeQueryParam = (key: string) => {
    searchParams.delete(key);
    navigate({
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    });
    // navigate({ search: `?${searchParams.toString()}` });
  };

  const handleModalOpen = useCallback((params: string) => {
    addQueryParam(params, "true");
    if (searchParams.has(params === "login" ? "signup" : "login")) {
      removeQueryParam(params === "login" ? "signup" : "login");
    }
  }, []);

  const handleProductCartOpen = useCallback(() => {
    console.log(isLogin,"cartttt")
    if (isLogin) {
      navigate('/cart');
    } else {
      handleModalOpen("login");
    }
  }, [isLogin]);

  useEffect(() => {
    const fetchUser = async () => {
      // console.log(token);
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
        } catch (error) {
        }
      } else {
        setIsLogin(false);
        setIsShow(true);
      }
    };

    fetchUser();
  }, [token]);

   console.log(isLogin,"test");
  return (
    <>
      {!show ? (
        // <Skeleton variant="rectangular" width={"100%"} className={styles.header}/>
        <Stack
          className={styles.header}/>
      ) : (
        <Stack
          className={styles.header}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          {isLogin ? (
            <>
              <p>Header</p>
              <Stack flexDirection={"row"} gap={"24px"} alignItems={"center"}>
              {location.pathname != "/cart" && <AddShoppingCartIcon onClick={handleProductCartOpen} />}
              <UserProfile />
              </Stack>
            </>
          ) : (
            <>
              <p>Header</p>
              <Stack flexDirection={"row"} gap={"24px"} alignItems={"center"}>
              <p onClick={() => handleModalOpen("login")}>Login</p>
              <p onClick={() => handleModalOpen("signup")}>Signup</p>
              <AddShoppingCartIcon onClick={handleProductCartOpen} />
              </Stack>
            </>
          )}
        </Stack>
      )}
      <Outlet />
      <LoginModal />
      <SignUpModal />
    </>
  );
};

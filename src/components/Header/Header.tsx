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
  const searchParams = new URLSearchParams(window.location.search);
  const token = localStorage.getItem("authToken");
  
  const addQueryParam = useCallback((key: string, value: string) => {
    searchParams.set(key, value);
    const updatedSearchString = `?${searchParams.toString()}`;
    navigate({ search: `?${searchParams.toString()}` });
  },[location?.search]);

  const removeQueryParam = (key: string) => {
    searchParams.delete(key);
    navigate({ search: `?${searchParams.toString()}` });
  };

  const handleModalOpen = useCallback((params: string) => {
    addQueryParam(params, "true");
    if (searchParams.has(params === "login" ? "signup" : "login")) {
      removeQueryParam(params === "login" ? "signup" : "login");
    }
  }, []);

  const handleProductCartOpen = useCallback(() => {
    if (isLogin) {
    } else {
      handleModalOpen("login");
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      console.log(token);
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

  // console.log(show, isLogin,"test");
  return (
    <>
      {!show ? (
        <Skeleton variant="rectangular" width={"100%"} className={styles.header}/>
      ) : (
        <Stack
          className={styles.header}
          flexDirection={"row"}
          justifyContent={"space-between"}
        >
          {isLogin ? (
            <>
              <p>Header</p>
              <AddShoppingCartIcon onClick={handleProductCartOpen} />
              <UserProfile />
            </>
          ) : (
            <>
              <p>Header</p>
              <p onClick={() => handleModalOpen("login")}>Login</p>
              <p onClick={() => handleModalOpen("signup")}>Signup</p>
              <AddShoppingCartIcon onClick={handleProductCartOpen} />
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

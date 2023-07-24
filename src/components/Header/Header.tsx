import { Box, Button, Stack } from "@mui/material";
import styles from "./header.module.scss";
import { Outlet, useSearchParams } from "react-router-dom";
// import { LoginModal, SignUpModal } from "../../shared/components/Modal";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginModal, SignUpModal } from "../../shared/components/Modal";
// import { LoginModal } from "../../shared/components/Modal/LoginModal";
// import { SignUpModal } from "../../shared/components/Modal/SignUpModal";

export const Header = () => {
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const addQueryParam = (key: string, value: string) => {
    searchParams.set(key, value);
    navigate({ search: `?${searchParams.toString()}` });
  };

  const removeQueryParam = (key: string) => {
    searchParams.delete(key);
    navigate({ search: `?${searchParams.toString()}` });
  };

  const handleModalOpen = (params: string) => {
    addQueryParam(params, "true");
    if(searchParams.has(params ==="login"?"signup":"login")){
        removeQueryParam(params ==="login"?"signup":"login")
    }
  };
  return (
    <>
      <Stack
        className={styles.header}
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <p>Header</p>
        <p onClick={() => handleModalOpen("login")}>Login</p>
        <p onClick={() => handleModalOpen("signup")}>Signup</p>
      </Stack>
      <Outlet />
      <LoginModal />
      <SignUpModal/>
    </>
  );
};

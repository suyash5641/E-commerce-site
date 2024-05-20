import {
  Alert,
  Button,
  CircularProgress,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../LoginModal/loginmodal.module.scss";
import * as yup from "yup";
import { useFormik } from "formik";
// import { SnackBar } from "../../SnackBar";
import { useAuth } from "../../../../sdk/context/AuthContext/AuthProvider";
interface FormValues {
  // username: string;
  email: string;
}
const validationSchemaa = yup.object({
  // username: yup.string().required("user name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

export const ForgotPasswordModal = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const location = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const { forgotPassword, loading } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSnackBar, setIsSnackBar] = useState<any>({
    isOpen: false,
    message: "",
    svg: "",
  });

  const handleClose = () => {
    setModalOpen(false);
    removeQueryParam("forgotpassword");
  };

  const removeQueryParam = (key: string) => {
    searchParams.delete(key);
    navigate({ search: `?${searchParams.toString()}` });
  };

  const formik: any = useFormik<FormValues>({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchemaa,
    onSubmit: async (values: any) => {
      const payload = {
        email: values?.email,
      };
      try {
        const result = await forgotPassword(payload);
        setIsSnackBar({
          isOpen: true,
          message: result,
          svg: "success",
        });
        //   setTimeout(()=>{
        //     handleClose();
        //   },5000);
      } catch (error) {
        setIsSnackBar({
          isOpen: true,
          message: error,
          svg: "error",
        });
      }
    },
  });

  useEffect(() => {
    if (
      searchParams.has("forgotpassword") &&
      localStorage.getItem("authToken") == null
    ) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isModalOpen) {
      setIsSnackBar({
        isOpen: false,
        message: "",
        svg: "",
      });
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  return (
    <Modal open={isModalOpen} onClose={handleClose}>
      <Stack className={styles.loginmodal} flexDirection={"column"}>
        {isSnackBar?.isOpen && (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert
              severity={isSnackBar.svg}
              onClose={() => {
                setIsSnackBar({
                  isOpen: false,
                  message: "",
                  svg: "",
                });
              }}
            >
              {isSnackBar.message}
            </Alert>
          </Stack>
        )}
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <Typography>Enter registered email id</Typography>
          <Stack
            flexDirection={"column"}
            alignItems={"center"}
            gap={"24px"}
            width={"100%"}
          >
            <TextField
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && !!formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
              className={styles.formfield}
            />
          </Stack>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" color="secondary" type="submit">
              Submit
            </Button>
          )}
        </form>
      </Stack>
    </Modal>
  );
};

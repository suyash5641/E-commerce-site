import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./signupmodal.module.scss";
import * as yup from "yup";
import { useFormik } from "formik";
import { SnackBar } from "../../SnackBar";
import { useAuth } from "../../../../sdk/context/AuthContext/AuthProvider";
// import { ILoginModalProps } from "../../interfaces/interface";
interface FormValues {
  username: string;
  email: string;
  password: string;
}
const validationSchemaa = yup.object({
  username: yup.string().required("user name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be 8 characters long")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol")
    .required("password is required"),
});

export const SignUpModal = () => {
  const location = useLocation();
  const [isSnackBar, setIsSnackBar] = useState<any>({
    isOpen: false,
    message: "",
    svg: "",
  });
  const searchParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  
  const {register,loading} = useAuth();
  const formik: any = useFormik<FormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchemaa,
    onSubmit: async (values: any) => {
      const payload = {
        username: values?.username,
        email: values?.email,
        password: values?.password,
      };
      try {
       await register(payload);
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
    if (searchParams.has("signup")) {
      setModalOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setModalOpen(false);
    removeQueryParam("signup");
  };

  const removeQueryParam = (key: string) => {
    searchParams.delete(key);
    navigate({ search: `?${searchParams.toString()}` });
  };

  useEffect(()=>{
      if(isModalOpen){
        setIsSnackBar({
          isOpen: false,
          message: '',
          svg: "",
        })
        formik.resetForm();
      }
  },[isModalOpen])

 
  return (
    <>
      <Modal open={isModalOpen} onClose={handleClose}>
        <Stack className={styles.loginmodal} flexDirection={"column"}>
          {isSnackBar?.isOpen && (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity={isSnackBar.svg} onClose={() => {
                setIsSnackBar({
                  isOpen: false,
                  message: '',
                  svg: "",
                })
              }}>
               {isSnackBar.message}
              </Alert>
            </Stack>
          )}
          <form onSubmit={formik.handleSubmit} className={styles.form}>
            <Typography>Create a new account</Typography>
            <Stack
              flexDirection={"column"}
              alignItems={"center"}
              gap={"24px"}
              width={"100%"}
            >
              <TextField
                label="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && !!formik.errors.username}
                helperText={formik.touched.username && formik.errors.username}
                className={styles.formfield}
              />

              <TextField
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && !!formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
                className={styles.formfield}
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && !!formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
                className={styles.formfield}
              />
            </Stack>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            )}
          </form>
        </Stack>
      </Modal>
    </>
  );
};

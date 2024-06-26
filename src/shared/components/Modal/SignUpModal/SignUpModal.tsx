import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Dialog,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./signupmodal.module.scss";
import * as yup from "yup";
import { useFormik } from "formik";
// import { SnackBar } from "../../SnackBar";
import { useAuth } from "../../../../sdk/context/AuthContext/AuthProvider";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// import CloseIcon from "@mui/icons-material/Close";
import { formbackground } from "../../../../assets";
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
  // const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const [isSnackBar, setIsSnackBar] = useState<any>({
    isOpen: false,
    message: "",
    svg: "",
  });
  const searchParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const { register, loading } = useAuth();
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
        handleClose();
      } catch (error) {
        setIsSnackBar({
          isOpen: true,
          message: error,
          svg: "error",
        });
      }
    },
  });

  const isSignUpModal = searchParams.get("signup");

  useEffect(() => {
    if (
      searchParams.has("signup") &&
      localStorage.getItem("authToken") == null
    ) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignUpModal]);

  const handleClose = () => {
    setModalOpen(false);
    removeQueryParam("signup");
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const handleModalOpen = () => {
    searchParams.delete("signup");
    searchParams.set("login", "true");
    navigate({ search: `?${searchParams.toString()}` });
  };

  const removeQueryParam = (key: string) => {
    searchParams.delete(key);
    navigate({ search: `?${searchParams.toString()}` });
  };

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
    <>
      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        PaperProps={{
          style: { borderRadius: "16px" },
        }}
      >
        <Stack className={styles.loginmodal} flexDirection={"column"}>
          <Stack className={styles.modalform}>
            <img
              src={formbackground}
              alt="background"
              width={"100%"}
              height={"100%"}
              style={{
                objectFit: "cover",
                borderRadius: "0px 0px 16px 16px",
              }}
            />
            {/* <Stack flexDirection={"row"} justifyContent={"end"}>
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{color:"blue"}} />
          </IconButton> */}
            {/* </Stack> */}
            <Stack className={styles.formcontainer}>
              <form onSubmit={formik.handleSubmit} className={styles.form}>
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
                <Stack
                  sx={{ width: "86%" }}
                  alignItems={"center"}
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                >
                  <Typography className="login-text">
                    Create an account
                  </Typography>
                  <Button
                    variant="outlined"
                    className="formbutton"
                    onClick={handleModalOpen}
                  >
                    <Typography
                      className="login-text-button"
                      textTransform={"capitalize"}
                    >
                      Login
                    </Typography>
                  </Button>
                </Stack>
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
                    helperText={
                      formik.touched.username && formik.errors.username
                    }
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
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && !!formik.errors.password}
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    className={styles.formfield}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useCallback, useEffect, useState } from "react";
import styles from "./forgotpassword.module.scss";
import * as yup from "yup";
import { useFormik } from "formik";
// import { SnackBar } from "../../shared/components/SnackBar";
// import { useAuth } from "../../sdk/context/AuthContext/AuthProvider";
import { ResetPassword } from "../ResetPassword";
import { BASE_URL } from "../../utils/constant/constant";
import { sucess } from "../../assets";
import { useNavigate } from "react-router-dom";
interface FormValues {
  email: string;
}

interface IForgotPassword {
  email: string;
}

const validationSchemaa = yup.object({
  // username: yup.string().required("user name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [title, setTitle] = useState<string>("Reset Account Password");
  const [loading, setIsLoading] = useState<boolean>(false);
  const [userEmail, setEmail] = useState<string>("");
  const [isSnackBar, setIsSnackBar] = useState<any>({
    isOpen: false,
    message: "",
    svg: "",
  });

  const formik: any = useFormik<FormValues>({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchemaa,
    onSubmit: async (values: any, { resetForm }) => {
      const payload = {
        email: values?.email,
      };
      setEmail(values?.email);
      try {
        const result = await forgotPassword(payload);
        setIsSnackBar({
          isOpen: true,
          message: result,
          svg: "success",
        });
        resetForm();
        setActiveStep(2);
      } catch (error) {
        setIsSnackBar({
          isOpen: true,
          message: error,
          svg: "error",
        });
      }
    },
  });

  const forgotPassword = useCallback(
    async (payload: IForgotPassword) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/users?filters[$and][0][email][$eq]=${payload?.email}`
        );

        const data = await response.json();
        if (data.length > 0) {
          const apiResponse = await fetch(`${BASE_URL}/send-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          if (apiResponse.status === 200) {
            setIsLoading(false);
            return `Reset password otp send to ${payload?.email}`;
          } else if (!apiResponse?.ok) {
            setIsLoading(false);
            // eslint-disable-next-line no-throw-literal
            throw "Some Error Occurred";
          }
        } else {
          setIsLoading(false);
          // eslint-disable-next-line no-throw-literal
          throw "Email is not registered";
        }
      } catch (error) {
        setIsLoading(false);
        // eslint-disable-next-line no-throw-literal
        throw error;
      }
    },
    [setIsLoading]
  );
  const handleActiveStepChange = (data: number, title: string) => {
    setActiveStep(data);
    setTitle(title);
  };

  const handleSnackBar = () => {
    setIsSnackBar({
      isOpen: false,
      message: "",
      svg: "",
    });
  };

  const addQueryParam = (key: string, value: string) => {
    // const currentURL = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(key, value);

    navigate({
      pathname: window.location.pathname,
      search: `?${urlParams.toString()}`,
    });
  };

  const handleLoginForm = () => {
    addQueryParam("login", "true");
  };

  useEffect(() => {
    setIsSnackBar({
      isOpen: false,
      message: "",
      svg: "",
    });
    formik.resetForm();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack className={styles.boxContainer} flexDirection={"column"}>
      <Stack className={styles.formcontainer}>
        {isSnackBar?.isOpen && (
          <Stack
            sx={{
              width: "100%",
              maxWidth: "400px",
              position: "absolute",
              top: "64px",
            }}
            spacing={2}
          >
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
        <Stack className={styles.resetPasswordFormContainer}>
          <Typography className={styles.formHeading}>{title}</Typography>
        </Stack>
        {activeStep === 1 && (
          <Stack sx={{ width: "100%", maxWidth: "400px", height: "320px" }}>
            <form onSubmit={formik.handleSubmit} className={styles.form}>
              <Typography className={styles.formText}>
                Enter Registered Email Id
              </Typography>
              <Stack
                flexDirection={"column"}
                alignItems={"center"}
                width={"100%"}
                margin={"16px 0px"}
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
                <Stack
                  flexDirection={"row"}
                  justifyContent={"center"}
                  margin={"16px 0px 16px 0px"}
                  height="36px"
                >
                  <CircularProgress
                    sx={{
                      height: "16px !important",
                      width: "16px !important",
                      marginTop: "8px",
                    }}
                  />
                </Stack>
              ) : (
                <Stack
                  flexDirection={"row"}
                  justifyContent={"center"}
                  margin={"16px 0px 16px 0px"}
                >
                  <Button variant="contained" color="secondary" type="submit">
                    Submit
                  </Button>
                </Stack>
              )}
            </form>
          </Stack>
        )}
        {activeStep === 2 && (
          <ResetPassword
            email={userEmail}
            handleActiveStepChange={handleActiveStepChange}
            handleSnackBar={handleSnackBar}
          />
        )}
        {activeStep === 3 && (
          <Stack className={styles.passwordSucessForm}>
            <Typography className={styles.resetPasswordText}>
              Password Reset Sucessfully
            </Typography>
            <Stack className={styles.imageSection}>
              <img src={sucess} alt="success" className={styles.image} />
            </Stack>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLoginForm}
            >
              Click Here To Login
            </Button>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
export default ForgotPassword;

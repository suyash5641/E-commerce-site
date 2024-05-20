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
  const [activeStep, setActiveStep] = useState<number>(1);
  const [loading, setIsLoading] = useState<boolean>(false);
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
          } else if (apiResponse.status === 400 || apiResponse.status === 500) {
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
        throw "Some Error Occurred";
      }
    },
    [setIsLoading]
  );
  const handleActiveStepChange = (data: number) => {
    setActiveStep(data);
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
              top: "100px",
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
        {activeStep === 1 && (
          <Stack sx={{ width: "100%", maxWidth: "400px" }}>
            <form onSubmit={formik.handleSubmit} className={styles.form}>
              <Typography className={styles.formText}>
                Enter registered email id
              </Typography>
              <Stack
                flexDirection={"column"}
                alignItems={"center"}
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
                <Stack flexDirection={"row"} justifyContent={"center"}>
                  <CircularProgress
                    sx={{
                      height: "16px !important",
                      width: "16px !important",
                    }}
                  />
                </Stack>
              ) : (
                <Stack
                  flexDirection={"row"}
                  justifyContent={"center"}
                  margin={"8px 0px 8px 0px"}
                >
                  <Button variant="contained" color="secondary" type="submit">
                    Submit
                  </Button>
                </Stack>
              )}
            </form>
          </Stack>
        )}
        {activeStep === 2 && <ResetPassword />}
      </Stack>
    </Stack>
  );
};
export default ForgotPassword;

import {
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Typography,
  CircularProgress,
  Stack,
  Alert,
  styled,
} from "@mui/material";
import OtpInput from "react-otp-input";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./resetpassword.module.scss";
import { BASE_URL } from "../../utils/constant/constant";

interface IResetPassword {
  identifier: string;
  newPassword: string;
  resendPasswordOtp: string;
}

interface IProps {
  email: string;
  handleActiveStepChange: (step: number, title: string) => void;
  handleSnackBar: () => void;
}

const ResponsiveInput = styled("input")(({ theme }) => ({
  width: "36px !important",
  height: "40px",
  [theme.breakpoints.down(300)]: {
    width: "28px !important",
    height: "32px",
  },
}));

export const ResetPassword = ({
  handleActiveStepChange,
  email,
  handleSnackBar,
}: IProps) => {
  const [showPassword, setShowPassword] = useState<Boolean>(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);

  const [isSnackBar, setIsSnackBar] = useState<any>({
    isOpen: false,
    message: "hello",
    svg: "",
  });

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
      .required("OTP is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
      otp: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        newPassword: values?.password,
        resendPasswordOtp: values?.otp,
        identifier: email,
      };
      handleSnackBar();

      try {
        const result = await resetPassword(payload);
        resetForm();
        handleActiveStepChange(3, "");
        setIsSnackBar({
          isOpen: true,
          message: result,
          svg: "success",
        });
      } catch (error) {
        setIsSnackBar({
          isOpen: true,
          message: error,
          svg: "error",
        });
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const resetPassword = async (payload: IResetPassword) => {
    try {
      const apiResponse = await fetch(`${BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const response = await apiResponse.json();
      if (apiResponse.status === 200) {
        setLoading(false);
        return `Password Reset Sucessfully`;
      } else if (!apiResponse?.ok) {
        setLoading(false);
        // eslint-disable-next-line no-throw-literal
        throw response?.error?.message;
      }
    } catch (error) {
      setLoading(false);
      // eslint-disable-next-line no-throw-literal
      throw error;
    }
  };

  return (
    <>
      {isSnackBar?.isOpen && (
        <Stack spacing={2} className={styles.snackBarContainer}>
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
        flexDirection={"column"}
        alignItems={"center"}
        className={styles.resetPasswordBoxContainer}
      >
        <Stack
          flexDirection={"column"}
          alignItems={"center"}
          className={styles.resetPasswordForm}
        >
          <Stack className={styles.textBox}>
            <Typography
              variant="h3"
              textAlign={"start"}
              className={styles.textTitle}
            >
              Enter six digit otp
            </Typography>
          </Stack>
          <OtpInput
            // value={otp}
            // onChange={setOtp}
            value={formik.values.otp}
            onChange={(value) => formik.setFieldValue("otp", value)}
            numInputs={6}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <ResponsiveInput {...props} />}
          />
          {formik.errors.otp && formik.touched.otp ? (
            <Stack>
              <Typography color="#E13A3A" fontSize="12px" textAlign={"start"}>
                {formik.errors.otp}
              </Typography>
            </Stack>
          ) : null}
          <Stack className={styles.createPassword}>
            <Typography
              variant="h3"
              textAlign={"start"}
              className={styles.textTitle}
            >
              Create a password
            </Typography>
          </Stack>
          <form onSubmit={formik.handleSubmit} className={styles.resetForm}>
            <TextField
              label=""
              name="password"
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              required
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
            <TextField
              type={showConfirmPassword ? "text" : "password"}
              label=""
              name="confirmPassword"
              placeholder="Confirm password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Stack flexDirection={"row"} gap={2.5}>
              <Button
                variant="contained"
                color="secondary"
                className={styles.resetPasswordButton}
                onClick={() => {
                  handleSnackBar();
                  handleActiveStepChange(1, "Reset Account Password");
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                className={styles.resetPasswordButton}
              >
                {loading ? <CircularProgress /> : "Submit"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Stack>
    </>
  );
};

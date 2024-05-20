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

const ResponsiveInput = styled("input")(({ theme }) => ({
  width: "36px !important",
  height: "40px",
  [theme.breakpoints.down(280)]: {
    width: "33px !important",
    height: "40px",
  },
}));

export const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  // const [code, setCode] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);

  const [isSnackBar, setIsSnackBar] = useState<any>({
    isOpen: false,
    message: "hello",
    svg: "",
  });

  const validationSchema = Yup.object().shape({
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
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const payload = {
        password: values?.password,
        passwordConfirmation: values?.confirmPassword,
      };
      setLoading(true);

      setLoading(false);
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

  return (
    // <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexDirection: 'column' }}>
    <Stack flexDirection={"column"} alignItems={"center"}>
      {isSnackBar?.isOpen && (
        <Stack
          sx={{ width: "240px", position: "absolute", top: "100px" }}
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
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span>-</span>}
          renderInput={(props) => <ResponsiveInput {...props} />}
        />
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
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            className={styles.resetPasswordButton}
          >
            {loading ? <CircularProgress /> : "Submit"}
          </Button>
        </form>
      </Stack>
    </Stack>
  );
};

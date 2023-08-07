import {
  TextField,
  IconButton,
  InputAdornment,
  Box,
  Button,
  Typography,
  CircularProgress,
  Stack,
  Alert,
} from "@mui/material";
import { useState ,useEffect} from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSearchParams } from "react-router-dom";

export const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const [code,setCode] = useState<string>("");
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  const [searchParams,setSearchParams] = useSearchParams();
  const [isSnackBar, setIsSnackBar] = useState<any>({
    isOpen: false,
    message: "",
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
      const payload= {
        code: code,
        password: values?.password,
        passwordConfirmation: values?.confirmPassword
      }
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

  useEffect(()=>{
    const code= searchParams.get('code');
     if(code){
      setCode(code);
     }
  },[searchParams])

  return (
    // <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexDirection: 'column' }}>
    <Stack flexDirection={"column"}>
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
      <Typography variant="h1" component="h1">
        Create a password
      </Typography>
      <form
        onSubmit={formik.handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          alignItems: "center",
        }}
      >
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
          sx={{
            width: "156px",
            height: "60px",
            border: "none",
            textTransform: "none",
            fontSize: "24px",
            fontWeight: "700",
          }}
        >
          {loading ? <CircularProgress /> : "Submit"}
        </Button>
      </form>
    </Stack>
  );
};

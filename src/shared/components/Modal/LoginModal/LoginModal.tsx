import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./loginmodal.module.scss";
import * as yup from "yup";
import { useFormik } from "formik";
// import { ILoginModalProps } from "../../interfaces/interface";
interface FormValues {
  // username: string;
  email: string;
  password: string;
}
const validationSchemaa = yup.object({
  // username: yup.string().required("user name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "The password must be 8 characters or longer and include at least one uppercase letter, one lowercase letter, one special character, and one number."
    )
    .required("password is required"),
});

export const LoginModal = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const formik: any = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchemaa,
    onSubmit: async (values: any) => {
      // await handleSubmit(values)
      console.log(values, "test");
    },
  });

  useEffect(()=>{
     if(searchParams.has('login')){
      setModalOpen(true);
     }
  },[searchParams])

  const handleClose = () => {
    setModalOpen(false);
    removeQueryParam('login');
  };

  const removeQueryParam = (key:string) => {
    searchParams.delete(key);
    navigate({ search: `?${searchParams.toString()}` });
  };

  return (
    <Modal open={isModalOpen} onClose={handleClose}>
      <Stack className={styles.loginmodal} flexDirection={"column"}>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
        <Typography>Login Form</Typography>
          <Stack flexDirection={"column"} alignItems={"center"} gap={"24px"} width={"100%"}>
          {/* <TextField
            label="Username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && !!formik.errors.username}
            helperText={formik.touched.username && formik.errors.username}
            className={styles.formfield}
          /> */}

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
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </form>
      </Stack>
    </Modal>
  );
};

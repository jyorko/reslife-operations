import { useState } from "react";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { Button, TextField, Box, Typography, InputAdornment } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import axios from "../axiosInstance";
import LoginLayout from "./SSRLayout";
import { object, string, TypeOf } from "zod";

const passwordSchema = object({
  password: string().min(8, "Password must be more than 8 characters").max(32, "Password must be less than 32 characters"),
});

type PasswordInput = TypeOf<typeof passwordSchema>;

const ChangePasswordPage = () => {
  const router = useRouter();
  const { session, email } = router.query;

  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitHandler: SubmitHandler<PasswordInput> = async (values) => {
    setLoading(true);
    const { password } = values;

    axios
      .post(`${process.env.NEXT_PUBLIC_PROXY_URL}/auth/set-first-password`, { email, password, session })
      .then((res) => {
        setLoading(false);
        console.log(res.data);
        router.push("/dashboard");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setError("password", { message: err.response.data.message });
      });
  };

  return (
    <LoginLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 5,
          alignItems: "center",
          minHeight: "100vh",
          padding: 6,
        }}
      >
        <Typography variant="h3">Set Password</Typography>
        <Typography variant="body1">This seems like your first time logging in, please set your password</Typography>
        <form onSubmit={handleSubmit(onSubmitHandler)} style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
          <TextField
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
            label="Password"
            type="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" type="submit">
            {loading ? "Loading..." : "Change Password"}
          </Button>
        </form>
      </Box>
    </LoginLayout>
  );
};

export default ChangePasswordPage;

import { Box, TextField, InputAdornment } from "@mui/material";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const loginSchema = object({
  email: string().nonempty("Email is required").email("Email is invalid"),
  password: string().nonempty("Password is required").min(8, "Password must be more than 8 characters").max(32, "Password must be less than 32 characters"),
});

type LoginInput = TypeOf<typeof loginSchema>;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmitHandler: SubmitHandler<LoginInput> = async (values) => {
    setLoading(true);
    const { email, password } = values;
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
      .then((res: any) => {
        // if Session cookie is set, it means the user needs to change their password (Session cookie should be present, not just any set-cookie header)
        // session cookie is not in res.

        if (res.error) {
          setError("email", {
            type: "manual",
            message: res.error,
          });
          setError("password", {
            type: "manual",
            message: res.error,
          });
          setLoading(false);
          return Promise.reject(new Error(res.error));
        }
        setLoading(false);
        router.push("/dashboard");
      })
      .catch((err) => {
        const sessionCookie = document.cookie.split(";").find((c) => c.trim().startsWith("Session="));

        if (sessionCookie) {
          router.push(`/change-password?session=${sessionCookie.split("=")[1]}&email=${email}`);
          return;
        }
        console.log("err: ");
        console.error(err);
      });
  };

  return (
    <Box
      sx={{
        maxWidth: "30rem",
        "@media (max-width: 600px)": {
          width: "90vw",
        },
      }}
    >
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmitHandler)}>
        <TextField
          sx={{ mb: 2 }}
          label="Email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
          fullWidth
          required
          type="email"
          error={!!errors["email"]}
          helperText={errors["email"] ? errors["email"].message : ""}
          {...register("email")}
        />
        <TextField
          sx={{ mb: 2 }}
          label="Password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
          fullWidth
          required
          type="password"
          error={!!errors["password"]}
          helperText={errors["password"] ? errors["password"].message : ""}
          {...register("password")}
        />
        <LoadingButton variant="contained" fullWidth type="submit" loading={loading}>
          Next
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default LoginPage;

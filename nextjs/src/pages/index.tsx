import Link from "next/link";
import { Button, Typography, Box } from "@mui/material";
import LoginComponent from "@/components/login/LoginComponent";
import Layout from "@/pages/SSRLayout";
import { getSession } from "next-auth/react";

export default function Page({}) {
  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "100vh",
          padding: 6,
        }}
      >
        <Typography variant="h3">Landing</Typography>
        <LoginComponent />
        <Link href="/test-api">
          <Button variant="contained">Will take you to test-api</Button>
        </Link>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

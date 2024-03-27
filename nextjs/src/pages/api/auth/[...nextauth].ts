import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "../../../axiosInstance";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";

type NextAuthOptionsCallback = (req: NextApiRequest, res: NextApiResponse) => NextAuthOptions;

const nextAuthOptions: NextAuthOptionsCallback = (req, res) => {
  return {
    pages: {
      signIn: "/",
    },
    providers: [
      CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials, req) {
          try {
            const { email, password }: Record<string, string> = credentials!;
            //if process.env.NEXT_PUBLIC_DOCKER_API_URL exists, use it as baseurl, otherwise keep the default
            const baseURL = process.env.NEXT_PUBLIC_DOCKER_API_URL || axios.defaults.baseURL;

            const response = await axios.post(`${process.env.NEXT_PUBLIC_PROXY_URL}/auth/signin`, {
              email,
              password,
            });

            if (response.data.newPasswordRequired) {
              res.setHeader("Set-Cookie", `Session=${response.data.session}; Path=/;`);
              throw new Error("User must set a new password");
            }

            const cookies = response.headers["set-cookie"];
            if (!cookies || !response.data.userData) return null;
            res.setHeader("Set-Cookie", cookies);
            return response.data.userData;
          } catch (err: any) {
            if (err.response.data) throw new Error(err.response.data.message);
            return null;
          }
        },
      }),
    ],
    session: {
      maxAge: 3600,
    },
    callbacks: {
      async jwt({ token, user }) {
        return { ...token, ...user };
      },
      async session({ session, token, user }) {
        session.user = token as any;
        return session;
      },
    },
  };
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};

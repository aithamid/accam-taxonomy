import NextAuth from "next-auth/next";
import { authConfig } from "@/pages/api/auth/[...nextauth]";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};

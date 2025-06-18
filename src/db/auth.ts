"use server";

import { authConfig } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";


export const getAuthSession = () => {
  return getServerSession(authConfig);
};



export const getRequiredAuthSession = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  return session;
};

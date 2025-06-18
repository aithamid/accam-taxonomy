"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  return (
    <Button
      onClick={async () => {
        await signOut(
          {
            callbackUrl: "/login",
          },
        );
      }}
      className="bg-red-500 text-white"
      type="submit"
    >
      Log out
    </Button>
  );
};

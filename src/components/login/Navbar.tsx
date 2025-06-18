import { Card } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authConfig } from "@/pages/api/auth/[...nextauth]";
import { LogoutButton } from "./logout";
import { getAuthSession, getRequiredAuthSession } from "@/db/auth";
import Link from "next/link";

export const Navbar = async () => {
  const session = await getRequiredAuthSession();
  return (
    <nav className="bg-gray-800 text-white px-8 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
        <Link href={`/`}>
          <h1 className="E-mail ml-2 text-xl font-semibold">Erena - Taxonomy</h1>
        </Link>
        </div>
        <div>
          <div className="flex items-center space-x-10">
            <span className="">{session.user?.name}</span>
            <span className="E-mail italic">{session.user?.email}</span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

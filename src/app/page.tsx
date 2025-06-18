import { getAuthSession } from "@/db/auth";
import { redirect } from "next/navigation";

export default function Home() {
    const session = getAuthSession();
    if (!session) {
        redirect('/login');
    }
    redirect('/dashboard');
}
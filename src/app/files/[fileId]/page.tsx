// Dynamic routing : [fileId].tsx

import { getAuthSession } from "@/db/auth";
import { redirect } from "next/navigation";
import prisma from "@/db/prisma";
import { Files } from "@prisma/client";
import { FileRenderer } from "./filehelper";
import { Navbar } from "@/components/login/Navbar";

async function getFile (fileId: string) {
    const data = await prisma.files.findUnique({
        where: {
            id: fileId
        }
    });

    return data;
}

export default async function Home({params} : {
    params: {
        fileId: string;
    }
}) {

    // Check if the user is authenticated
    const session = await getAuthSession();
    if (!session) {
        redirect('/login');
    }

    // Check if the fileId is valid and it's owned by the user if not redirect to 404 page

    const file = await getFile(params.fileId);

    if (!file) {
        redirect('/404');
    }

    return (
        <>
        <Navbar />
        <FileRenderer {...file}/>
        </>
    );
}

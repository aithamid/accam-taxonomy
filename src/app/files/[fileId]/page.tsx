// Dynamic routing : [fileId].tsx
"use client";
import { redirect } from "next/navigation";
import { FileRenderer } from "./filehelper";
import Link from "next/link";

function getFile (fileId: string) {
    const storedFiles = window.localStorage.getItem("taxonomyFiles");
    if (!storedFiles) {
        return null;
    }
    
    const files = JSON.parse(storedFiles);
    const file = files.find((f: { id: string }) => f.id === fileId);
    if (!file) {
        return null;
    }

    return file;
}

export default function Home({params} : {
    params: {
        fileId: string;
    }
}) {


    // Check if the fileId is valid and it's owned by the user if not redirect to 404 page

    const file = getFile(params.fileId);

    if (!file) {
        redirect('/404');
    }

    console.log("File id :", params.fileId);

    return (
        <>
            <nav className="bg-gray-800 text-white px-8 py-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                <Link href={`/`}>
                <h1 className="E-mail ml-2 text-xl font-semibold">ACCAM Taxonomy</h1>
                </Link>
                </div>
            </div>
            </nav>
        <FileRenderer {...file}/>
        </>
    );
}

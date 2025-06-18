import { getServerSession } from "next-auth";
import { authConfig } from "@/pages/api/auth/[...nextauth]";
import LoginForm from "@/components/login/loginform";
import { LogOut } from "lucide-react";
import { LogoutButton } from "@/components/login/logout";
import { Navbar } from "@/components/login/Navbar";
import prisma from "@/db/prisma";
import { getAuthSession, getRequiredAuthSession } from "@/db/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FileForm } from "@/server/addfile";
import { FileType, Files, Prisma } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { revalidatePath, revalidateTag } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EditFileName } from "@/components/dashboard/EditFileName";
import { useRouter } from 'next/router';
import React from "react";
import { DuplicateButton } from "@/components/dashboard/duplicate";

async function getData() {
  const session = await getAuthSession();
  if (!session) {
    redirect('/login');
  }
  const data = await prisma.files.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

async function getFileType() {
    const data = await prisma.fileType.findMany();
    revalidatePath('/dashboard');
    return data;
}



export default async function Home() {
  let data : Files[] = await getData();
  let types : FileType[] = await getFileType();
  const session = await getServerSession(authConfig);
  if (!session) {
    redirect('/login');
  }
  async function deleteFile(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    // find first and delete
    const file = await prisma.files.findFirst({
      where: {
        id: id,
      },
    });
    if (!file) {
      return;
    }

    await prisma.files.delete({
      where: {
        id: id,
      },
    });
    revalidatePath('/dashboard');
  }



  return (
    <>
      <Navbar></Navbar>
      <div className="grid place-items-center">
        <div className="w-1/2 m-5" >
            <FileForm filetypes={types} />
        </div>
      </div>
      <div className="grid place-items-center">
        <div className="w-3/4">
        <h2 className="text-2xl font-bold mb-4 text-center">Your taxonomy files</h2>
        <ul>
          {data.map((file) => (
            <Card key={file.id} className="h-14 p-2 m-3">
            <div className="w-full h-full relative flex justify-between items-center">
                <div className="w-full">
                    <a>{file.name}</a><br/><a></a>
                </div>
                <div className="mr-2">
                  <EditFileName file={file} />
                </div>
                <DuplicateButton fileId={file.id} />
                <div className="ml-2">
                <Link href={`/files/${file.id}`}><Button>Modify </Button></Link>
                </div>
                <div className="ml-2">
                <form action={deleteFile}>
                    <Button className="bg-red-600 hover:bg-red-400" type="submit" name="id" value={file.id}>Delete</Button>
                </form>
                </div>
            </div>
            </Card>
          ))}
        </ul>
        </div>
      </div>
    </>
  );
}
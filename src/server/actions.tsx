"use server";

import { getRequiredAuthSession } from "@/db/auth";
import prisma from "@/db/prisma";
import { typeformSchema } from "./addfile";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { taxonomySchema } from "@/interfaces/taxonomy";
import { Prisma } from "@prisma/client";
import { FormRenameFile } from "@/components/dashboard/EditFileName";
import { Router } from "next/router";

export const createFile = async (formData: z.infer<typeof typeformSchema>) => {
    const type = formData.filetypes.value;
    const name = formData.filename;
    const session = await getRequiredAuthSession();
    const userId = session.user.id
    const jsonfile_example = await prisma.fileType.findUnique(
        {
            where: {
                id: type
            }
        }
    );

    const newFile = await prisma.files.create({
        data: {
            name: name,
            userId: userId ?? "", // Provide a default value for userId
            filetypeId: type,
            jsonfile: jsonfile_example?.jsonfile as Prisma.JsonObject,
        }
    });
    revalidatePath('/')

    return newFile;
}

export const getTaxonomyFiles = async () => {
    const session = await getRequiredAuthSession();
    const data = await prisma.files.findMany(
        {
            where: {
                userId: session.user.id,
            },
        }
    );
    return data;
}

export async function deleteFile(fileId : string) {
    "use server";
    const id = fileId;
    await prisma.files.delete({
      where: {
        id: id,
      },
    });
    revalidatePath('/dashboard');
}

export const updateFile = async (formData: z.infer<typeof taxonomySchema>, fileId: string) => {
    const updatedFile = await prisma.files.update({
        where: {
            id: fileId
        },
        data: {
            jsonfile: formData,
        }
    });
    revalidatePath('/dashboard')

    return updatedFile;
}

export const renameFile = async (formData: FormRenameFile) => {
    await prisma.files.updateMany({
        where: {
            id: formData.fileId
        },
        data: {
            name: formData.name,
        }
    });

    revalidatePath('/dashboard');
}

export const duplicate = async (fileId: string) => {
    // Find the file
    await prisma.files.findUnique({
        where: {
            id: fileId
        }
    }).then(async (data) => {
        if(data) {
            await prisma.files.create({
                data: {
                    name: data.name + " (copy)",
                    jsonfile: data.jsonfile as Prisma.JsonObject,
                    filetypeId: data.filetypeId,
                    userId: data.userId,
                }
            });
        }
    });

    revalidatePath('/dashboard');
}
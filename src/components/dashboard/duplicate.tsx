"use client";

import { Button } from "@/components/ui/button";
import prisma from "@/db/prisma";
import { duplicate } from "@/server/actions";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/router";

// Duplicate button 
interface DuplicateButtonProps {
    fileId: string;
  }

export function DuplicateButton({fileId} : DuplicateButtonProps ) {

      return (
        <Button hidden className=" bg-green-500 hover:bg-green-400" onClick={async () => {
            await duplicate(fileId);
        }}>Duplicate</Button>
      )
}
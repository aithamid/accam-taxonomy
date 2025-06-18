// EditFileName.tsx
"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { zodResolver } from "@hookform/resolvers/zod";
import { Files } from "@prisma/client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField } from "../ui/form";
import { renameFile } from "@/server/actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(2).max(50),
    fileId: z.string(),
});

export type FormRenameFile = z.infer<typeof formSchema>;

interface EditFileNameProps {
  file: Files;
}

export function EditFileName({file}:EditFileNameProps){

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: file.name,
      fileId: file.id,
    },
  });

  const onSubmit = async (data: FormRenameFile) => {
    await renameFile(data);
    router.replace('/dashboard');
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit name</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit file name</SheetTitle>
          <SheetDescription>
            Change your file name here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => onSubmit(data))} >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              File name
            </Label>
            <Input {...form.register("name")} type="text" defaultValue={file.name} className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
        </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
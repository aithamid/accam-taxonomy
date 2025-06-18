"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRequiredAuthSession } from "@/db/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import prisma from "@/db/prisma";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileType } from "@prisma/client";
import { addFile } from "@/server/helper-addfile";
import { useRouter } from "next/navigation";

const listSchema = z.object({
  list: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
    }),
  ),
  value: z.string(),
});

export const typeformSchema = z.object({
  filename: z.string().min(2).max(50),
  filetypes: listSchema,
});

export const FileForm = (
    { filetypes }: { filetypes: FileType[] },
) => {

  const filetypesList = filetypes.map((filetype) => {
    return {
      id: filetype.id,
      label: filetype.name,
    };
  });

  const form = useForm<z.infer<typeof typeformSchema>>({
    resolver: zodResolver(typeformSchema),
    defaultValues: {
      filename: "",
      filetypes: {
        list: filetypesList,
        value: filetypesList[0].id,
      },
    },
  });

  const router = useRouter();

  return (
    <>
    <div>
        <h1 className="text-2xl font-bold text-center">Add a new file</h1>
    </div>
    <div className="flex flex-row justify-center my-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(addFile )} className="flex items-center">
          <Input {...form.register("filename")} placeholder="File name" style={{ marginRight: '8px' }} />
          <FormField
            control={form.control}
            name="filetypes.value"
            render={({ field }) => (
              <FormItem style={{ margin: '0 8px' }}>
                <Select
                  defaultValue={filetypesList[0].id}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type of file" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filetypesList.map((filetype) => {
                      return (
                        <SelectItem key={filetype.id} value={filetype.id}>
                          {filetype.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" onClick={router.refresh}>Create</Button>
        </form>
      </Form>
    </div>
    </>
  );
  
}
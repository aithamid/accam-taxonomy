import { typeformSchema } from "./addfile";
import { z } from "zod";
import { createFile } from "./actions";
import { useRouter } from "next/navigation";


export const addFile = async (formData: z.infer<typeof typeformSchema>) => {
    const jsonfile_example = await createFile(formData);
}


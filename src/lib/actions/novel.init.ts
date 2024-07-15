"use server";
import { z } from "zod";
import { getToken } from "../apiCall/server/getToken";
import { POST, TResponseDto } from "../http";
import { TNovel } from "../types/api/novel";

export type THandleInitNovelState = {
  validatedForm?: boolean;
  message: string;
  novel?: TNovel;
};

export async function handleInitNovel(
  previousState: unknown,
  formData: FormData
): Promise<THandleInitNovelState> {
  console.log(formData);

  const formSchema = z.object({
    name: z.string().min(1),
    requirements: z.string().min(1),
  });

  const parse = formSchema.safeParse({
    name: formData.get("name"),
    requirements: formData.get("requirements"),
  });

  if (!parse.success) {
    console.log("error");
    return { validatedForm: false, message: "Please fill all the fields" };
  }

  const data = parse.data;

  const resp = await POST<TResponseDto<TNovel>>({
    url: "/novel/init",
    token: await getToken(),
    data,
    config: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  return {
    validatedForm: true,
    message: "Novel initialized successfully",
    novel: resp?.data,
  };
}

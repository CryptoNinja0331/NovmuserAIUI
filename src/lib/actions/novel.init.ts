"use server";
import { z } from "zod";

export async function handleInitNovel(prevState: any, formData: FormData) {
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
    return { message: "fill all the fields" };
  }

  const data = parse.data;
  console.log(data);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/novel/init`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      return { message: "Novel initialized successfully", data: responseData };
    } else {
      console.error("Failed to initialize novel");
      return { message: "Failed to initialize novel" };
    }
  } catch (e) {
    return { message: "Failed to initialize novel" };
  }
}

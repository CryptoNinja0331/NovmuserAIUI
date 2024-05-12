import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
  }),

  endpoints: (builder) => ({
    getCreatedNovel: builder.query<
      any,
      { page_number: string; page_size: string; userId: string | null }
    >({
      query: (arg) => {
        const { page_number, page_size, userId } = arg;
        return {
          url: `/novel/page?page_number=${page_number}&page_size=${page_size}`,
          headers: { Authorization: `Bearer ${userId}` },
        };
      },
    }),
  }),
});

export const { useGetCreatedNovelQuery } = clientApi;
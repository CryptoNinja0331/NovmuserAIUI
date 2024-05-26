import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
  }),
  tagTypes: ["novelData"],

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
      providesTags: ["novelData"],
    }),
    deleteNovel: builder.mutation({
      query: (arg) => {
        const { novelId, userId } = arg;
        return {
          url: `/novel/${novelId}`,
          headers: { Authorization: `Bearer ${userId}` },

          method: "DELETE",
        };
      },
      invalidatesTags: ["novelData"],
    }),
    initChapter: builder.mutation({
      query: (arg) => {
        const { novelId, chapterKey, userId } = arg;
        return {
          url: `/chapter/init/${novelId}/${chapterKey}`,
          headers: { Authorization: `Bearer ${userId}` },

          method: "POST",
        };
      },
      invalidatesTags: ["novelData"],
    }),
  }),
});

export const {
  useGetCreatedNovelQuery,
  useDeleteNovelMutation,
  useInitChapterMutation,
} = clientApi;

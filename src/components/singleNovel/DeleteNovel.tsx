"use client";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { showWarningAlert, showSuccessfulAlert } from "@/lib/alerts";
import { useDeleteNovelMutation } from "@/lib/apiCall/client/clientAPi";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { todo } from "node:test";

export default function DeleteNovel(props: any) {
  const [deleteFn, { isLoading }] = useDeleteNovelMutation();
  const router = useRouter();
  const { getToken } = useAuth();

  const handleNovelDelete = async (novel_id: any) => {
    const token = await getToken({ template: "UserToken" });
    showWarningAlert({
      showCancelButton: true,
      confirmButtonText: "Yes, deletel it!",
      title: "Are you absolutely sure?",
      text: "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
      // target: `#${TOPIC_EDITING_TREE_ID}`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFn({
          novelId: novel_id,
          userId: token,
        });
        showSuccessfulAlert({
          title: "Deleted!",
          text: "Your story has been deleted.",
        });
        // todo: 没有刷新小说列表。昊哥修复一下
        router.push(`/allnovels`);
      }
    });
  };
  return (
    <RiDeleteBin6Line
      className=" text-2xl text-[#FF453A] cursor-pointer"
      onClick={() => handleNovelDelete(props.novel_id)}
    />
  );
}

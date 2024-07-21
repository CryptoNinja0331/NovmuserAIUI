"use client";
import { showSuccessfulAlert, showWarningAlert } from "@/lib/alerts";
import { useDeleteNovelMutation } from "@/lib/apiCall/client/clientAPi";
import { refreshNovelPage } from "@/lib/apiCall/server/getAllNovel";
import { useGetClientToken } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

export type TDeleteNovelProps = {
  novelId: string;
  afterDeleteCallback?: () => Promise<void>;
};

const DeleteNovel: FC<TDeleteNovelProps> = ({
  novelId,
  afterDeleteCallback,
}) => {
  const [deleteFn, { isLoading }] = useDeleteNovelMutation();
  const router = useRouter();
  const { getClientToken } = useGetClientToken();

  const handleNovelDelete = async (novelId: string) => {
    const token = await getClientToken();
    showWarningAlert({
      showCancelButton: true,
      confirmButtonText: "Yes, deletel it!",
      title: "Are you absolutely sure?",
      text: "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteFn({
          novelId: novelId,
          userId: token,
        });
        showSuccessfulAlert({
          title: "Deleted!",
          text: "Your story has been deleted.",
        });
        await afterDeleteCallback?.();
      }
    });
  };
  return (
    <RiDeleteBin6Line
      className=" text-2xl text-[#FF453A] cursor-pointer"
      onClick={() => handleNovelDelete(novelId)}
    />
  );
};

export default DeleteNovel;

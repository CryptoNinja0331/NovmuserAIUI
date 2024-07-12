"use client";
import { useDeleteNovelMutation } from "@/lib/apiCall/client/clientAPi";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";

import TopUpDialog from "@/app/(dashboard)/_components/TopUpDialog/TopUpDialog";
import UserCredits from "../userInfo/UserCredits";
import NovelDetailsItem from "./NovelDetailsItem";
const displayNames = {
  brain_storming: "Brain Storming",
  characters: "Characters",
  world_view: "World View",
  plot_outline: "Plot Outline",
  chapter_outline: "Chapter Outline",
} as const;

type DisplayNameKeys = keyof typeof displayNames;

const NovelSidebar = ({ novelDetails }: { novelDetails: any }) => {
  const [openNOvelSheet, setNovelSheet] = useState(true);
  const [deleteFn, { isLoading }] = useDeleteNovelMutation();
  const router = useRouter();
  const { getToken } = useAuth();
  const [ isExpanded, updateExpanded ] = useState<boolean>(true)
  const handleDeleteNovel = async () => {
    const token = await getToken({ template: "UserToken" });

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "linear-gradient(90deg,#a993fe,0%,#7e61e7)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFn({
          novelId: novelDetails.id,
          userId: token,
        });
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        router.push(`/`, { scroll: false });
      }
    });
  };



  return (
    <div className="relative">
      <div
        onClick={() => { updateExpanded(true) }}
        style={ isExpanded ? { display: 'none' } : { }}
        className="cursor-pointer w-[2rem] flex gap-2 items-center p-2 bg-[#392e70]"
      >
        <BiSolidLeftArrow className="text-white" />
        {/*<IoMdSettings className="text-white"/>*/}
      </div>

        <div
          className={`bg-[#16112f65] transition-all duration-500 ease-in-out backdrop-blur-lg  text-white p-0 ${ isExpanded ? 'w-[15rem]' : 'w-0'}`}
        >
          {
            isExpanded && (
              <React.Fragment>
                <div className="border-b border-input p-3 flex items-center justify-between">
                  <BiSolidRightArrow
                    onClick={() => updateExpanded(false)}
                    className="text-white cursor-pointer" />
                  <h1 className="font-medium">Dashboard</h1>
                  <RiDeleteBin6Line
                    onClick={handleDeleteNovel}
                    className="mr-8 text-[#FF453A] cursor-pointer"
                  />
                </div>
                <div className="p-2 border-b border-input text-center tracking-wider">
                  <div className="p-2 bg-violet-950">
                    <UserCredits />
                  </div>
                  <TopUpDialog />
                </div>
                <div className="p-2 space-y-3">
                  { Object.keys(novelDetails?.details).map((name) => (
                    <NovelDetailsItem
                      key={name}
                      name={name as DisplayNameKeys}
                      data={novelDetails?.details[name]}
                    />
                  ))}
                </div>
              </React.Fragment>
            )
          }
        </div>
    </div>
  );
};

export default NovelSidebar;

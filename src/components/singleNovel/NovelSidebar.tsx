"use client";
import { BiSolidLeftArrow } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { useDeleteNovelMutation } from "@/lib/apiCall/client/clientAPi";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { HiCurrencyDollar } from "react-icons/hi2";
import { HiOutlineUpload } from "react-icons/hi";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import NovelDetailsItem from "./NovelDetailsItem";
import UserCredits from "../userInfo/UserCredits";

const NovelSidebar = ({ novelDetails }: { novelDetails: any }) => {
  const [openNOvelSheet, setNovelSheet] = useState(true);
  const [deleteFn, { isLoading }] = useDeleteNovelMutation();
  const router = useRouter();
  const { getToken } = useAuth();

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

  const displayNames = {
    brain_storming: "Brain Storming",
    characters: "Characters",
    world_view: "World View",
    plot_outline: "Plot Outline",
    chapter_outline: "Chapter Outline",
  } as const;

  type DisplayNameKeys = keyof typeof displayNames;

  return (
    <div className="relative">
      <div
        onClick={() => setNovelSheet(!openNOvelSheet)}
        className="cursor-pointer absolute top-0 right-0 flex gap-2 items-center p-2 bg-[#191B31]  "
      >
        <BiSolidLeftArrow className="text-white" />

        <IoMdSettings className="text-white" />
      </div>

      <Sheet
        modal={false}
        defaultOpen={true}
        open={openNOvelSheet}
        onOpenChange={setNovelSheet}
      >
        <SheetContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="bg-[#16112f65] backdrop-blur-lg w-[15rem] text-white p-0"
        >
          <div className="border-b border-input p-3 flex items-center justify-between">
            <h1 className="font-medium">Dashboard</h1>
            <RiDeleteBin6Line
              onClick={handleDeleteNovel}
              className="mr-8 text-[#FF453A] cursor-pointer"
            />
          </div>
          <div className="p-2 border-b border-input text-center tracking-wider">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="mx-auto bg-bluish flex gap-2 mt-1 hover:bg-background hover:text-white"
                >
                  <UserCredits />
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-[#150f2d] text-white flex justify-center items-center">
                <div>
                  <div className="text-xl font-medium ">
                    <h1 className="flex flex-row heading-color !text-xl gap-1">
                      <span>Balance :</span>
                      <UserCredits showIcon={false} />
                    </h1>
                  </div>

                  <Button
                    onClick={() => router.push(`/payment`, { scroll: false })}
                    variant="outline"
                    className="mx-auto flex bg-bluish gap-2 mt-8 hover:bg-background hover:text-white"
                  >
                    <HiOutlineUpload className="text-xl" />
                    Top Up
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="p-2 space-y-3">
            {Object.keys(novelDetails?.details).map((name) => (
              <NovelDetailsItem
                key={name}
                name={name as DisplayNameKeys}
                data={novelDetails?.details[name]}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NovelSidebar;

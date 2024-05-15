'use client';;
import { BiSolidLeftArrow } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from 'sweetalert2';
import { useDeleteNovelMutation } from "@/lib/apiCall/client/clientAPi";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const NovelSidebar = ({ novelDetails }: { novelDetails: any }) => {


    const [openNOvelSheet, setNovelSheet] = useState(true)
    const [deleteFn, { isLoading }] = useDeleteNovelMutation()
    const router = useRouter()
    const { getToken } = useAuth();

    const displayNames = {
        'brain_storming': 'Brain Storming',
        'characters': 'Characters',
        'world_view': 'World View',
        'plot_outline': 'Plot Outline',
        'chapter_outline': 'Chapter Outline'
    };

    const handleDeleteNovel = async () => {
        const token = await getToken({ template: "UserToken" });

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteFn({
                    novelId: novelDetails.id,
                    userId: token

                })
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
                router.push(`/`, { scroll: false })

            }
        });
    }





    return (
        <div className="relative">
            <div onClick={() => setNovelSheet(!openNOvelSheet)} className="cursor-pointer absolute top-0 right-0 flex gap-2 items-center p-2 bg-[#191B31]  ">
                <BiSolidLeftArrow className="text-white" />

                <IoMdSettings className="text-white" />
            </div>

            <Sheet
                modal={false}
                defaultOpen={true} open={openNOvelSheet} onOpenChange={setNovelSheet}>
                <SheetContent onInteractOutside={(e) => {
                    e.preventDefault();
                }}
                    className="bg-[#170F21] w-[17rem] text-white p-0">
                    <div className="border-b border-input p-3 flex items-center justify-between">
                        <h1 className="font-medium">Dashboard</h1>
                        <RiDeleteBin6Line onClick={handleDeleteNovel} className="mr-8 text-[#FF453A] cursor-pointer" />
                    </div>
                    <div className="p-2 border-b border-input text-center tracking-wider">
                        <h1 className="text-[1.05rem]">User Info</h1>
                        <p className="text-sm font-semibold">500 Credits</p>
                    </div>
                    <div className="p-2 space-y-3">
                        {(Object.keys(novelDetails?.details) as (keyof typeof displayNames)[]).map((name) => (
                            <div key={name} className="bg-[#150F2D] tracking-wide rounded-md p-3 cursor-pointer">
                                <p>{displayNames[name]}</p>
                            </div>
                        ))}
                    </div>


                </SheetContent>
            </Sheet>
        </div>
    );
};

export default NovelSidebar;
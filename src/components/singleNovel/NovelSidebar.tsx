'use client';;
import { BiSolidRightArrow } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";


const NovelSidebar = ({ novelDetails }) => {


    const [openNOvelSheet, setNovelSheet] = useState(true)


    const displayNames = {
        'Brain Storming': 'brain_storming',
        'Characters': 'characters',
        'World View': 'world_view',
        'Plot Outline': 'plot_outline',
        'Chapter Outline': 'chapter_outline'
    };

    return (
        <div className="relative">
            <div onClick={() => setNovelSheet(!openNOvelSheet)} className="cursor-pointer absolute top-0 right-0 flex gap-2 items-center p-2 bg-[#191B31]  ">
                <BiSolidRightArrow className="text-white" />
                <IoMdSettings className="text-white" />
            </div>

            <Sheet
                modal={false}
                defaultOpen={true} open={openNOvelSheet} onOpenChange={setNovelSheet}>
                <SheetContent onInteractOutside={(e) => {
                    e.preventDefault();
                }}
                    className="bg-[#170F21] w-[17rem] text-white p-0">

                    <div className="p-2">
                        <button type="button" className="absolute text-white right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg><span className="sr-only">Close</span></button>
                    </div>



                    <div className="border-b border-input p-2">
                        <h1 className="">Dashboard</h1>
                    </div>
                    <div className="p-2">
                        <h1>User Info</h1>
                        <p>500 Credits</p>
                    </div>
                    <div className="p-2">

                        {Object.keys(novelDetails).map((name) => (
                            <p key={name}>{name}</p>
                        ))}

                    </div>


                </SheetContent>
            </Sheet>
        </div>
    );
};

export default NovelSidebar;
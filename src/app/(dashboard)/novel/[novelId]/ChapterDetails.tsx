
import { Button } from "@/components/ui/button";
import { Chapter } from "./page";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useSearchParams } from 'next/navigation';
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
interface ChapterDetailsProps {
    chapter: Chapter | null;
    onBackClick: () => void;
}

const ChapterDetails = ({ chapter, onBackClick }: ChapterDetailsProps) => {

    const searchParams = useSearchParams()

    const novelId = searchParams.get('novelId')
    const chapterKey = chapter?.chapter_key
    const { isLoaded, sessionId, getToken } = useAuth();

    useEffect(() => {

        async function initChapter() {
            const token = await getToken({ template: "UserToken" });

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/chapter/init/${novelId}/${chapterKey}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                }
            );
        }
        initChapter();
    }, [chapterKey, getToken, novelId])








    if (!chapter) return null;

    return (
        <div className="div h-full">
            <button className="flex bg-[#150F2D] rounded-md p-1 text-sm items-center gap-1" onClick={onBackClick}>
                <IoArrowBackCircleOutline />
                Chapter List
            </button>


            <div className=" tracking-wide rounded-md p-3 font-medium">
                {chapter?.chapter_number}
                {""} <span> : {chapter.title}</span>

            </div>


            <div className="mt-4 bg-[#150F2D] text-center rounded-tl-[20px] rounded-tr-[20px] h-full">
                <h1 className="p-2 font-medium  border-b border-input">Topic Roadmap</h1>
                <div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-bluish text-center flex gap-2 mx-auto mt-3 hover:bg-background hover:text-white">Initialize Topics</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[40vw] bg-[#150F2D] text-white">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">

                            </div>
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>

    );
};

export default ChapterDetails;
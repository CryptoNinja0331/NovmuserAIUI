'use client';;
import { useEffect, useState } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import Image from "next/image";
import logo from '@/assets/logo-tiny.svg';
import NovelInitForm from "./novelInitForm";
import { useAuth } from "@clerk/nextjs";
import { useGetCreatedNovelQuery } from "@/lib/apiCall/client/clientAPi";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./button";
import { useRouter } from 'next/navigation';
interface NovelDetails {
    brain_storming: null;
    chapter_outline: null;
    characters: null;
    plot_outline: null;
    world_view: null;
}

interface NovelMetadata {
    name: string;
    requirements: string;
    author_id: string;
    created_at: string;
    status: string;
    updated_at: string;
}

interface Novel {
    id: string;
    content: null;
    details: NovelDetails;
    metadata: NovelMetadata;
}

const ExpandSidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [novelData, setNovelData] = useState<Novel[]>([]);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const { isLoaded, sessionId, getToken } = useAuth();

    useEffect(() => {
        const fetchUserId = async () => {
            const token = await getToken({ template: "UserToken" });
            setUserId(token);
        };

        if (isLoaded) {
            fetchUserId();
        }
    }, [isLoaded, getToken]);

    const { isLoading, data, error } = useGetCreatedNovelQuery({
        page_number: "1",
        page_size: "8",
        userId: userId,
    });

    useEffect(() => {
        if (!isLoading && isLoaded && data?.data?.records) {
            setNovelData(data.data.records);
        }
    }, [isLoading, isLoaded, data?.data?.records]);


    const router = useRouter()
    const handleNavigate = (id: string) => {
        router.push(`/${id}`, { scroll: false })
    }

    const handleViewMore = () => {
        router.push(`/allnovels`, { scroll: false })
    }






    return (
        <div className={`h-full transition-all duration-500 ease-in-out ${isExpanded ? 'w-[17rem] bg-[#170F21]' : 'w-16'}`}>
            <div className="flex flex-col ">
                {isExpanded ? (
                    <div className="flex-grow border-r ">
                        <div className="flex min-h-[65px] pl-4 border-b border-gray-700">
                            <div onClick={() => router.push(`/`, { scroll: false })} className="flex cursor-pointer gap-1 mr-2 items-center">
                                <Image className="cursor-pointer" width={30} height={30} src={logo} alt="logo" />
                                <h1 className="font-medium text-xl">NovmuserAi</h1>
                            </div>
                            <div onClick={toggleSidebar} className="px-[15px] flex justify-center items-center border-l border-gray-700 cursor-pointer">
                                <BiSolidLeftArrow className="text-white" />
                            </div>
                            <div className="px-[15px] flex justify-center items-center border-l border-gray-700 cursor-pointer">
                                <IoMdSettings className="text-white cursor-pointer" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <NovelInitForm />

                            <div className="mt-6">
                                {novelData?.length !== 0 ? (
                                    <>
                                        <div className="div space-y-3 px-4">
                                            {novelData?.map((item) => (
                                                <div onClick={() => handleNavigate(item.id)} key={item.id} className="text-[#817691] font-medium text-[1.1rem] capitalize cursor-pointer p-3 bg-[#231B2C] rounded-lg">{item.metadata.name}</div>
                                            ))}
                                        </div>
                                        <Button onClick={handleViewMore} variant="outline" className="mx-auto flex mt-6 hover:bg-background hover:text-white" >View More...</Button>
                                    </>
                                ) : (
                                    <div className=" space-y-8">
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-[250px] bg-[#655e70]" />
                                            <Skeleton className="h-3 w-[200px] bg-[#655e70]" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-[250px] bg-[#655e70]" />
                                            <Skeleton className="h-3 w-[200px] bg-[#655e70]" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-[250px] bg-[#655e70]" />
                                            <Skeleton className="h-3 w-[200px] bg-[#655e70]" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div onClick={toggleSidebar} className="cursor-pointer flex gap-2 items-center p-2 bg-[#191B31] absolute top-[2rem]">
                        <Image width={20} height={20} src={logo} alt="logo" />
                        <BiSolidRightArrow className="text-white" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpandSidebar;
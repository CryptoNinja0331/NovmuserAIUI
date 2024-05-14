'use client';;
import { useEffect, useState } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import Image from "next/image";
import logo from '@/assets/logo-tiny.svg';
import NovelInitForm from "./novelInitForm";
import { useAuth } from "@clerk/nextjs";
const ExpandSidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    console.log(userId);
    const { isLoaded, sessionId, getToken } = useAuth();

    useEffect(() => {
        const fetchUserId = async () => {
            const token = await getToken();
            setUserId(token);
        };

        if (isLoaded) {
            fetchUserId();
        }
    }, [isLoaded, getToken]);

    useEffect(() => {
        console.log('hii');
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/novel/page?page_number=1&page_size=10`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userId}`,
                    },
                });



                console.log(response, 'res');




                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setData(data);
            } catch (error) {
                console.log(error);

            } finally {
                setIsLoading(false);
            }
        };




        if (userId) {
            fetchData();
        }

    }, [userId]);



    return (
        <div className={`h-full transition-all duration-500 ease-in-out ${isExpanded ? 'w-[17rem] bg-gradient-to-t to-[#101e2a08] from-[#101C27]' : 'w-16'}`}>
            <div className="flex flex-col ">
                {isExpanded ? (
                    <div className="flex-grow border-r ">
                        <div className="flex min-h-[65px] pl-4 border-b border-gray-700">
                            <div className="flex gap-1 mr-2 items-center">
                                <Image width={30} height={30} src={logo} alt="logo" />
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

                            <div className="mt-6 bg-red-600 text-blue-600">
                                {
                                    userId
                                }
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
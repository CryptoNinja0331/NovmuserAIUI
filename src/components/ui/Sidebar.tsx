'use client';
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { useState } from 'react';
import Image from "next/image";
import logo from '@/assets/logo-tiny.svg';
import NovelInitForm from "./novelInitForm";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const toggleSidebar = () => {


    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`min-h-screen text-white z-20 transition-all duration-300 ease-in-out ${isExpanded ? 'w-[17rem] bg-gradient-to-t to-[#101e2a08] from-[#101C27]' : 'w-16'}`}>
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

export default Sidebar;
'use client';
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { useState } from 'react';
import Image from "next/image";
import logo from '@/assets/logo-tiny.svg';
const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`z-10 text-white transition-all duration-300 ease-in-out ${isExpanded ? 'w-[17rem] bg-transparent' : 'w-16'
        }`}
    >
      <div className="flex items-center  border-b border-gray-700">
        {isExpanded ? (
          <div className="flex self-stretch items-center min-h-[65px] pl-4">
            <div className="flex gap-1 mr-2 items-center">
              <Image width={30} height={30} src={logo} alt="logo" />
              <h1 className="font-medium text-xl">NovmuserAi</h1>
            </div>

            <div onClick={toggleSidebar} className="px-[15px] flex justify-center items-center h-full border-l border-gray-700 cursor-pointer">
              <BiSolidLeftArrow className="text-white " />

            </div>
            <div className="px-[15px] flex justify-center items-center h-full border-l border-gray-700 cursor-pointer">
              <IoMdSettings className="text-white cursor-pointer" />
            </div>

          </div>
        ) : (
          <div onClick={toggleSidebar} className="cursor-pointer">
            <BiSolidRightArrow className="text-white" />
          </div>
        )}
      </div>
      <div>
        {/* Sidebar content */}
      </div>
    </div>
  );
};

export default Sidebar;
import { TWsMsgDto } from "@/lib/types/api/websocket";
import React from "react";
import { TEditStatus } from "./agentCard";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TChapter, TChapterOutline } from "@/lib/types/api/agent";
import { Textarea } from "../ui/textarea";
import { formatLabelText } from "@/lib/utils";
import { IoMdPricetag } from "react-icons/io";
import { BiSolidUser } from "react-icons/bi";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export type TChapterOutlineUiProps = {
  novelMsg: TWsMsgDto;
  editStatus: TEditStatus;
};

const ChapterOutlineUi: React.FC<TChapterOutlineUiProps> = ({
  novelMsg,
  editStatus,
}) => {
  const saveEdit = () => {
    console.log("保存");
  };
  React.useEffect(() => {
    if (editStatus == "save") {
      saveEdit();
    } else if (editStatus == "edit") {
      console.log("可编辑");
    }
  }, [editStatus]);

  const chapterOutlineData = React.useMemo<TChapterOutline>(() => {
    if (typeof novelMsg.msg === "string") {
      try {
        return JSON.parse(novelMsg.msg) as TChapterOutline;
      } catch (e) {
        return novelMsg.msg;
      }
    } else {
      return novelMsg.msg;
    }
  }, [novelMsg.msg]);

  const renderChapterOutlineCard = React.useCallback(
    (chapter: TChapter) => {
      return (
        <Card className="p-1 rounded-2xl border-purple-500 bg-indigo-950/80 text-white">
          <CardTitle>
            <div className="flex flex-col items-center justify-center gap-4 my-2">
              <h1 className="font-bold font-mono">{chapter.chapter_number}</h1>
              <h2 className="text-lg font-semibold font-serif ">
                {chapter.title}
              </h2>
            </div>
          </CardTitle>
          <CardContent className="flex flex-col self-stretch justify-center px-6 py-3 gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex gap-1 items-center">
                <h2 className="font-bold text-md">Summary</h2>
                <AiOutlineExclamationCircle size={20} color={"#818cf8"} />
              </div>
              <Textarea
                disabled={editStatus !== "edit"}
                defaultValue={chapter.summary}
                style={{ minHeight: "80px" }}
                className="text-[#eee0ffd9] font-semibold text-sm resize-none"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex gap-1 items-center">
                <h2 className="font-bold text-md">Major Events</h2>
                <AiOutlineExclamationCircle size={20} color={"#818cf8"} />
              </div>
              {chapter.major_events?.map((event, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center self-stretch gap-1"
                >
                  <IoMdPricetag size={24} className="text-purple-500" />
                  <Textarea
                    disabled={editStatus !== "edit"}
                    defaultValue={event}
                    style={{ minHeight: "40px" }}
                    className="text-[#eee0ffd9] font-semibold text-sm resize-none"
                  />
                </div>
              ))}
            </div>
            {/* Render characters */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex gap-1 items-center">
                <h2 className="font-bold text-md">Characters</h2>
                <AiOutlineExclamationCircle size={20} color={"#818cf8"} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {chapter.characters?.map((character, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 border-purple-400 rounded-xl p-2 border-2"
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <BiSolidUser className="text-indigo-300" size={24} />
                      <p className="font-bold text-xs">{character.name}</p>
                    </div>
                    <Textarea
                      disabled={editStatus !== "edit"}
                      defaultValue={character.description}
                      style={{ minHeight: "40px" }}
                      className="text-[#eee0ffd9] font-semibold text-xs resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
            {Object.keys(chapter)
              .filter(
                (key) =>
                  [
                    "conflict",
                    "emotional_development",
                    "revealed_information",
                    "chapter_end",
                  ].indexOf(key) !== -1
              )
              .map((key, index) => (
                <div key={index} className="flex-1 flex flex-col gap-2">
                  <div className="flex gap-1 items-center">
                    <h2 className="font-bold text-md capitalize">{`${formatLabelText(
                      key
                    )}`}</h2>
                    <AiOutlineExclamationCircle size={20} color={"#818cf8"} />
                  </div>
                  <Textarea
                    disabled={editStatus !== "edit"}
                    defaultValue={(chapter as any)[key] ?? ""}
                    style={{ minHeight: "64px" }}
                    className="text-[#eee0ffd9] font-semibold text-sm min-h-8 resize-none"
                  />
                </div>
              ))}
          </CardContent>
        </Card>
      );
    },
    [editStatus]
  );

  return (
    <div>
      <div className="flex flex-col items-center">
        <Carousel className="w-full max-w-2xl">
          <CarouselContent>
            {(chapterOutlineData.chapters ?? []).map((chapter, index) => (
              <CarouselItem key={index}>
                {renderChapterOutlineCard(chapter)}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default ChapterOutlineUi;

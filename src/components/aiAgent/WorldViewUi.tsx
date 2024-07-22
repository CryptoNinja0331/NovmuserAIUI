import { TWorldView } from "@/lib/types/api/agent";
import { TWsMsgDto } from "@/lib/types/api/websocket";
import React from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BiSolidBinoculars } from "react-icons/bi";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import { GiBookshelf, GiGreekTemple, GiHillConquest } from "react-icons/gi";
import { HiMiniInformationCircle } from "react-icons/hi2";
import { IoMdPricetag } from "react-icons/io";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { RiPoliceBadgeLine } from "react-icons/ri";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { TEditStatus } from "./agentCard";

type TWorldViewUiSubCardData = {
  titleIcon: React.ReactElement;
  title: string;
  attrName: keyof Omit<
    TWorldView,
    "novel_type" | "novel_style" | "point_of_view"
  >;
  description?: string;
  type?: "text" | "textList";
};

export type TWorldViewUiProps = {
  novelMsg: TWsMsgDto;
  editStatus: TEditStatus;
};

const WorldViewUi: React.FC<TWorldViewUiProps> = ({ novelMsg, editStatus }) => {
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

  const worldViewData = React.useMemo<TWorldView>(() => {
    if (typeof novelMsg.msg === "string") {
      try {
        return JSON.parse(novelMsg.msg) as TWorldView;
      } catch (e) {
        return novelMsg.msg;
      }
    } else {
      return novelMsg.msg;
    }
  }, [novelMsg.msg]);

  const renderBasinInfoItem = React.useCallback(
    ({ label, value }: { label: string; value: string }) => {
      return (
        <div className="flex-1 flex gap-2">
          <p className="font-bold">{label}:</p>
          <p>{value}</p>
        </div>
      );
    },
    []
  );

  const subCardDatas = React.useMemo<TWorldViewUiSubCardData[]>(() => {
    return [
      {
        titleIcon: <GiHillConquest size={32} />,
        title: "Geography",
        attrName: "geography",
        type: "text",
        // TODO 2024-07-22 add description
        description: "",
      },
      {
        titleIcon: <RiPoliceBadgeLine size={32} />,
        title: "Policies",
        attrName: "politics",
        type: "text",
        // TODO 2024-07-22 add description
        description: "",
      },
      {
        titleIcon: <FaMoneyBillWaveAlt size={32} />,
        title: "Economy",
        attrName: "economy",
        type: "text",
        // TODO 2024-07-22 add description
        description: "",
      },
      {
        titleIcon: <BiSolidBinoculars size={32} />,
        title: "Culture",
        attrName: "culture",
        type: "text",
        // TODO 2024-07-22 add description
        description: "",
      },
      {
        titleIcon: <MdOutlineAccessTimeFilled size={32} />,
        title: "History",
        attrName: "history",
        type: "text",
        // TODO 2024-07-22 add description
        description: "",
      },
      {
        titleIcon: <HiMiniInformationCircle size={32} />,
        title: "Key Issues",
        attrName: "key_issues",
        type: "text",
        // TODO 2024-07-22 add description
        description: "",
      },
      {
        titleIcon: <GiGreekTemple size={32} />,
        title: "Important Landmarks",
        attrName: "important_landmarks",
        type: "textList",
        // TODO 2024-07-22 add description
        description: "",
      },
    ];
  }, []);

  return (
    <div>
      <div className="flex flex-col p-2">
        <Card className="border-purple-500 bg-slate-950 rounded-xl">
          <CardTitle className="text-white mt-4 mb-10">
            <div className="flex items-center justify-center gap-2">
              <GiBookshelf size={28} className="text-white" />
              <span>Basic Information</span>
            </div>
          </CardTitle>
          <CardContent className="grid grid-cols-2 text-white text-lg gap-2">
            {renderBasinInfoItem({
              label: "Novel Type",
              value: worldViewData.novel_type,
            })}
            {renderBasinInfoItem({
              label: "Novel Style",
              value: worldViewData.novel_style,
            })}
            {renderBasinInfoItem({
              label: "Point of View",
              value: worldViewData.point_of_view,
            })}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 mt-4 p-2 gap-x-8 gap-y-4">
        {subCardDatas.map((item, index) => {
          return (
            <Card
              key={index}
              className="border-purple-500 bg-slate-950 rounded-lg p-4"
            >
              <CardTitle className="text-white">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row items-center gap-4">
                    {item.titleIcon}
                    <h1 className="text-lg">{item.title}</h1>
                  </div>
                  <AiOutlineExclamationCircle size={20} color={"#818cf8"} />
                </div>
              </CardTitle>
              <CardContent className="mt-4 p-0">
                {item.type === "text" && (
                  <Textarea
                    disabled={editStatus !== "edit"}
                    defaultValue={worldViewData[item.attrName] ?? ""}
                    style={{ minHeight: "64px" }}
                    className="text-[#eee0ffd9] font-semibold text-sm min-h-8 resize-none"
                  />
                )}
                {item.type === "textList" && (
                  <div className="flex flex-col gap-2">
                    {((worldViewData[item.attrName] ?? []) as string[]).map(
                      (item, index) => {
                        return (
                          <div
                            key={index}
                            className="flex flex-row items-center gap-2"
                          >
                            <IoMdPricetag
                              size={24}
                              className="text-purple-500"
                            />
                            <Textarea
                              disabled={editStatus !== "edit"}
                              key={index}
                              defaultValue={item}
                              style={{ minHeight: "64px" }}
                              className="text-[#eee0ffd9] font-semibold text-sm min-h-8 resize-none"
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WorldViewUi;

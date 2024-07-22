import { TPlotOutline, TSubplot } from "@/lib/types/api/agent";
import { cn, formatLabelText } from "@/lib/utils";
import React, { FC } from "react";
import { AiOutlineArrowDown, AiOutlineExclamationCircle } from "react-icons/ai";
import { BiSolidUser } from "react-icons/bi";
import { IoMdPricetag } from "react-icons/io";
import "react-vertical-timeline-component/style.min.css";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { TEditStatus } from "./agentCard";
import { TWsMsgDto } from "@/lib/types/api/websocket";

export type TPlotUiProps = {
  novelMsg: TWsMsgDto;
  editStatus: TEditStatus;
};

type TPlotData = {
  title: string;
  description?: string;
  renderer?: React.ReactNode;
};

const PlotItemCard: FC<TPlotData> = ({ title, description, renderer }) => {
  return (
    <Card className="w-[60%] max-w-[40rem] rounded-3xl bg-blue-950/30 border-[#9649f1] border-4">
      <div className="flex flex-row justify-center mt-2 mb-6">
        <div className="flex flex-row items-center gap-2 px-4 py-2 rounded-md bg-violet-950 ">
          <CardTitle className="text-lg text-white font-bold">
            {title}
          </CardTitle>
          <AiOutlineExclamationCircle size={20} color={"#818cf8"} />
        </div>
      </div>
      {renderer}
    </Card>
  );
};

const PlotUi: React.FC<TPlotUiProps> = ({ novelMsg, editStatus }) => {
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
  const plotOutlineData: TPlotOutline = React.useMemo(() => {
    if (typeof novelMsg.msg === "string") {
      try {
        return JSON.parse(novelMsg.msg) as TPlotOutline;
      } catch (e) {
        return novelMsg.msg;
      }
    } else {
      return novelMsg.msg;
    }
  }, [novelMsg.msg]);

  console.log("🚀 ~ editStatus:", editStatus);

  const renderTextField = React.useCallback(
    (
      rootField: any,
      fieldFilter: (value: string, index: number, array: string[]) => unknown,
      titleClassName?: string | undefined
    ) => {
      return Object.keys(rootField)
        .filter(fieldFilter)
        .map((key, index) => (
          <CardContent key={index}>
            <div className="flex gap-1 items-center text-[#eee0ff66] capitalize mb-2 font-medium text-[1rem]">
              <div className={cn("mr-1", titleClassName)}>
                {formatLabelText(key)}
              </div>
              <AiOutlineExclamationCircle size={20} color={"#818cf8"} />
            </div>
            <Textarea
              disabled={editStatus !== "edit"}
              defaultValue={rootField[key] ?? ""}
              style={{ minHeight: "64px" }}
              className="text-[#eee0ffd9]  font-semibold text-sm min-h-8 resize-none"
            />
          </CardContent>
        ));
    },
    [editStatus]
  );

  const renderSubplots = React.useCallback(
    (subplots: TSubplot[]) => {
      if (subplots.length < 1) {
        return null;
      }
      return (
        <CardContent>
          <div className="flex gap-1 items-center text-[#eee0ff66] capitalize mb-2 font-medium text-[1rem]">
            <div className="mr-1">Subplots</div>
            <AiOutlineExclamationCircle size={20} color={"#818cf8"} />
          </div>
          <div className="flex flex-col items-center gap-2">
            {subplots.map((subplot, index) => (
              <div
                key={index}
                className="flex flex-row items-center self-stretch gap-1"
              >
                <IoMdPricetag size={24} className="text-purple-500" />
                <div className="flex-1 bg-violet-500/30 p-2 rounded-lg">
                  {renderTextField(
                    subplot,
                    (key) => key !== "involved_characters",
                    "text-[0.8rem]"
                  )}
                  <CardContent className="flex flex-col gap-1 text-[#eee0ff66] capitalize mb-2 font-medium text-[0.8rem] py-2">
                    <div className="flex flex-row gap-1">
                      <div className="mr-1">Involved Characters</div>
                      <AiOutlineExclamationCircle size={20} color={"#818cf8"} />
                    </div>
                    {subplot?.involved_characters &&
                      subplot.involved_characters.length > 0 && (
                        <div className="flex flex-row flex-wrap gap-2 items-baseline justify-start">
                          {subplot.involved_characters.map(
                            (characterName, index) => (
                              <div
                                key={index}
                                className="flex flex-col items-center"
                              >
                                <BiSolidUser
                                  className="text-indigo-300"
                                  size={36}
                                />
                                <p className="text-white font-semibold text-xs">
                                  {characterName}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </CardContent>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      );
    },
    [renderTextField]
  );

  console.log(
    "🚀 ~ plotData ~ plotOutlineData['beginning']:",
    plotOutlineData["beginning"]
  );

  const plotData = React.useMemo<TPlotData[]>(() => {
    const { beginning, development, climax, ending } = plotOutlineData;
    console.log(
      "🚀 ~ plotData ~ (beginning as any)[key] ?? ",
      (beginning as any)["scene"] ?? ""
    );
    return [
      {
        title: "Begining",
        // TODO 2024-07-20 Replace description
        description: "Begining",
        renderer: (
          <div>
            {renderTextField(beginning, (key) => key !== "main_characters")}
            <CardContent>
              <div className="flex gap-1 items-center text-[#eee0ff66] capitalize mb-2 font-medium text-[1rem]">
                <div className="mr-1">Main Characters</div>
                <AiOutlineExclamationCircle size={20} color={"#818cf8"} />
              </div>
              {beginning.main_characters &&
                beginning.main_characters.length > 0 && (
                  <div className="flex flex-row flex-wrap gap-2 items-center justify-start">
                    {beginning.main_characters.map((characterName, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <BiSolidUser className="text-indigo-300" size={48} />
                        <p className="text-white font-semibold text-xs">
                          {characterName}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
            </CardContent>
          </div>
        ),
      },
      {
        title: "Development",
        description: "Development",
        renderer: (
          <div>
            {renderTextField(development, (key) => key !== "subplots")}
            {renderSubplots(development.subplots ?? [])}
          </div>
        ),
      },
      {
        title: "Climax",
        description: "Climax",
        renderer: <div>{renderTextField(climax, () => true)}</div>,
      },
      {
        title: "Ending",
        description: "Ending",
        renderer: <div>{renderTextField(ending, () => true)}</div>,
      },
    ];
  }, [plotOutlineData, renderSubplots, renderTextField]);

  return (
    <div>
      <div className="flex flex-col gap-1 items-center justify-start">
        {plotData.map((event, index) => (
          <React.Fragment key={index}>
            <PlotItemCard
              {...{
                title: event.title,
                description: event.description,
                renderer: event.renderer,
              }}
            />
            {index < plotData.length - 1 ? (
              <AiOutlineArrowDown size={48} className="text-green-300" />
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PlotUi;

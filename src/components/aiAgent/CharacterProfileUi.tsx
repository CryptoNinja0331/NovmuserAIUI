import React, { useEffect } from "react";
import { Textarea } from "../ui/textarea";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { GrUserFemale, GrUser } from "react-icons/gr";
import { BsQuestionOctagon } from "react-icons/bs";
import { TEditStatus } from "./agentCard";

interface CharacterProfileUiProps {
  novelMsg: any | null;
  editStatus: TEditStatus;
}
const NotAllEditElement = ["name", "age", "sex", "nationality"];
const CharacterProfileUi: React.FC<CharacterProfileUiProps> = ({
  novelMsg,
  editStatus,
}) => {
  let data = {};
  if (typeof novelMsg.msg == "string") {
    try {
      data = JSON.parse(novelMsg.msg);
    } catch (e) {
      data = novelMsg.msg;
    }
  }
  const getAvatar = (sex: string) => {
    const style: React.CSSProperties = {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
    };
    if (sex == "male") {
      return (
        <div
          style={style}
          className={"flex items-center justify-center bg-[#60a5fa]"}
        >
          <GrUser size={85} color={"#172554"} />
        </div>
      );
    } else if (sex == "female") {
      return (
        <div
          style={style}
          className={"flex items-center justify-center bg-[#e879f9]"}
        >
          <GrUserFemale size={85} color={"#4a044e"} />
        </div>
      );
    } else {
      return (
        <div
          style={style}
          className={"flex items-center justify-center bg-[#f97316]"}
        >
          <BsQuestionOctagon size={100} color={"#000"} />
        </div>
      );
    }
  };
  const saveEdit = () => {
    console.log("保存");
  };
  useEffect(() => {
    if (editStatus == "save") {
      saveEdit();
    } else if (editStatus == "edit") {
      console.log("可编辑");
    }
  }, [editStatus]);
  return (
    <div className="charecter">
      <div className=" mx-auto">
        <div className=" my-4  pb-2">
          <h1 className="text-[#fff] mb-2 font-semibold text-center">
            Main Characters
          </h1>
        </div>
        <div className="gap-16 items-center ">
          {data?.main_characters?.map((character: any, index: number) => {
            // Extract keys from the character object
            const keys = Object.keys(character);
            return (
              <div
                key={index}
                style={{ borderRadius: "10px" }}
                className=" p-5 mb-5 border-4 border-[#9649f1]  bg-[#1e063d]"
              >
                <div className="flex items-center mb-2">
                  <div className="mr-10">{getAvatar(character.sex)}</div>
                  <div className="flex-1">
                    <div className="flex">
                      <div className="">Name：</div>
                      <div>{character.name}</div>
                    </div>
                    <div className="flex">
                      <div className="">Age：</div>
                      <div>{character.age}</div>
                    </div>
                    <div className="flex">
                      <div className="">Sex：</div>
                      <div>{character.sex}</div>
                    </div>
                    <div className="flex">
                      <div className="">Nationality：</div>
                      <div>{character.nationality || "Unknown"}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between ">
                  {keys
                    .filter((key) => !NotAllEditElement.includes(key))
                    .map((key: string, keyIndex: number) => (
                      <div
                        key={keyIndex}
                        style={{ width: "48%" }}
                        className="justify-center items-center  mt-4 w-full"
                      >
                        <div className=" flex text-[#eee0ff66] capitalize mb-2 font-medium text-[1rem]">
                          <div className="mr-1">{key}</div>
                          <AiOutlineExclamationCircle
                            size={20}
                            color={"#818cf8"}
                          />
                        </div>
                        <Textarea
                          disabled={editStatus !== "edit"}
                          style={{ minHeight: "50px" }}
                          defaultValue={character[key]}
                          className="text-[#eee0ffd9]  font-semibold text-sm"
                        />
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <div className=" my-4  pb-2  mt-8">
            <h1 className="text-[#fff] mb-2 font-semibold text-center">
              Supporting Characters
            </h1>
          </div>

          <div className="gird grid-cols-2 gap-4 w-full">
            {data?.supporting_characters?.map(
              (character: any, index: number) => {
                // Extract keys from the character object
                const keys = Object.keys(character);

                return (
                  <div
                    key={index}
                    style={{ borderRadius: "10px" }}
                    className=" p-5 mb-5 border-4 border-[#9649f1]  bg-[#1e063d]"
                  >
                    <div className="flex items-center mb-2">
                      <div className="mr-10">{getAvatar(character.sex)}</div>
                      <div className="flex-1">
                        <div className="flex">
                          <div className="">Name：</div>
                          <div>{character.name}</div>
                        </div>
                        <div className="flex">
                          <div className="">Age：</div>
                          <div>{character.age}</div>
                        </div>
                        <div className="flex">
                          <div className="">Sex：</div>
                          <div>{character.sex}</div>
                        </div>
                        <div className="flex">
                          <div className="">Nationality：</div>
                          <div>{character.nationality || "Unknown"}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between ">
                      {keys
                        .filter((key) => !NotAllEditElement.includes(key))
                        .map((key: string, keyIndex: number) => (
                          <div
                            key={keyIndex}
                            style={{ width: "48%" }}
                            className="justify-center items-center  mt-4 w-full"
                          >
                            <div className=" flex text-[#eee0ff66] capitalize mb-2 font-medium text-[1rem]">
                              <div className="mr-1">{key}</div>
                              <AiOutlineExclamationCircle
                                size={20}
                                color={"#818cf8"}
                              />
                            </div>
                            <Textarea
                              disabled={editStatus !== "edit"}
                              style={{ minHeight: "50px" }}
                              defaultValue={character[key]}
                              className="text-[#eee0ffd9]  font-semibold text-sm"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfileUi;

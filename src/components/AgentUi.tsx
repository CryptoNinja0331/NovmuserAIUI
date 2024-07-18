import React, { useState, useEffect } from "react";
// import aiAgent from '../assets/images/artificial-intelligence 2.png';
import aiAgent from "../assets/images/tick.svg";
import Image from "next/image";
import { FaRobot } from "react-icons/fa6";
import BrainstormingUi from "./aiAgent/BrainstormingUi";
import WorldViewUi from "./aiAgent/WorldViewUi";
import CharacterProfileUi from "./aiAgent/CharacterProfileUi";
import ChapterOutlineUi from "./aiAgent/ChapterOutlineUi";
import PlotUi from "./aiAgent/PlotUi";
import { TNovelPrepareWsMsgKeys } from "@/lib/types/api/websocket";

interface Agent {
  name: string;
  key: string;
  novel: string | null;
  working: boolean;
}

interface AgentUiProps {
  novelMsg: string | null;
  finishedPrepare: boolean | null;
}

const AgentTitleKey: Record<TNovelPrepareWsMsgKeys, string> = {
  brain_storming: "Brain Storming",
  novel_world_generation: "World View",
  character_generation: "Character Profile",
  plot_planning: "Plot",
  chapter_outline_generation: "Chapter Outline",
  // finish_prepare: "",
  // prepare_novel: "",
};

const keys = Object.keys(AgentTitleKey);
const AgentUi: React.FC<AgentUiProps> = ({ novelMsg, finishedPrepare }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [preparing, setPreparing] = useState<boolean>(true);

  useEffect(() => {
    if (novelMsg) {
      const message = JSON.parse(novelMsg);
      const msgKey = message.msg_key as TNovelPrepareWsMsgKeys;
      if (msgKey === "finish_prepare") {
        return;
      }
      console.log(message, "message");
      setAgents((preAgents) => {
        if (keys.includes(message.msg_key)) {
          const index = preAgents.findIndex(
            (item) => item.key == message.msg_key
          );
          if (index === -1) {
            preAgents.push({
              name: AgentTitleKey[msgKey],
              key: message.msg_key,
              novel: message,
              working: false,
            });
          } else {
            preAgents[index] = {
              name: AgentTitleKey[msgKey],
              key: message.msg_key,
              novel: message,
              working: false,
            };
          }
        }

        return preAgents;
      });
    }
  }, [novelMsg]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className=" mx-auto">
      {agents.length > 0 && (
        <div className="flex gap-8 w-full">
          <div className="w-[80%]">
            <div
              style={{ maxHeight: "90vh" }}
              className="overflow-y-auto overflow-x-hidden"
            >
              <div className=" bg-[#170F21] agent-card border-2 shadow-md border-input p-6 text-sm rounded-md">
                {agents[activeTab] && agents[activeTab].novel !== null ? (
                  activeTab === 0 ? (
                    <BrainstormingUi novelMsg={agents[activeTab].novel} />
                  ) : activeTab === 1 ? (
                    <WorldViewUi novelMsg={agents[activeTab].novel} />
                  ) : activeTab === 2 ? (
                    <CharacterProfileUi novelMsg={agents[activeTab].novel} />
                  ) : activeTab === 3 ? (
                    <PlotUi novelMsg={agents[activeTab].novel} />
                  ) : activeTab === 4 ? (
                    <ChapterOutlineUi novelMsg={agents[activeTab].novel} />
                  ) : (
                    <div>{agents[activeTab].novel}</div>
                  )
                ) : agents[activeTab] && agents[activeTab].working ? (
                  <div>{agents[activeTab].name} is working, please wait...</div>
                ) : null}
              </div>
            </div>
          </div>
          <div
            className="w-[20%] space-y-4 p-4 bg-[#170F21] shadow-md rounded-md border-input border overflow-auto"
            style={{ maxHeight: "90vh" }}
          >
            {agents.map((agent, index) => (
              <div key={agent.key} onClick={() => handleTabChange(index)}>
                <div
                  className={`${
                    activeTab === index ? "active-tab" : ""
                  }  relative list-none cursor-pointer flex gap-4 items-center justify-between agent-sidebar-item`}
                >
                  <div className="flex gap-2 items-center">
                    <div className="item-icon-conatiner">
                      <FaRobot className="text-[1.5rem] item-icon" />
                    </div>
                    <span className="item-name">{agent.name}</span>
                  </div>
                  <Image src={aiAgent} alt="ai gent" width={20} height={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="">
        {finishedPrepare ? (
          <div>{"Agent is working, please wait..."}</div>
        ) : (
          <div>Finished Prepare</div>
        )}
      </div>
    </div>
  );
};

export default AgentUi;

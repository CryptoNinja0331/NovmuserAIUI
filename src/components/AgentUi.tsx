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
import { cloneDeep } from "lodash-es";

interface Agent {
  name: string;
  key: string;
  novel: string | null;
  status: boolean;
}

interface AgentUiProps {
  novelMsg: string | null;
  finishedPrepare: boolean | null;
}

const AgentTitleKey: Record<TNovelPrepareWsMsgKeys, string | undefined> = {
  brain_storming: "Leader Writer",
  novel_world_generation: "World Builder",
  character_generation: "Character Designer",
  plot_planning: "Plot Designer",
  chapter_outline_generation: "Outline Planner",
  finish_prepare: undefined,
  prepare_novel: undefined,
} as const;

const keys = Object.keys(AgentTitleKey);
const AgentUi: React.FC<AgentUiProps> = ({ novelMsg, finishedPrepare }) => {
  const [agents, setAgents] = useState<Agent[]>(
    keys.map((key) => {
      return {
        name: AgentTitleKey[key],
        key: key,
        novel: "",
        working: false,
      } as Agent;
    })
  );
  const [activeTab, setActiveTab] = useState<number>(-1);
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
        let updateAgent = cloneDeep(preAgents);
        if (keys.includes(message.msg_key)) {
          const index = updateAgent.findIndex(
            (item) => item.key == message.msg_key
          );
          updateAgent[index] = {
            ...updateAgent[index],
            novel: message,
            working: true,
          } as Agent;
          if (index == 0) {
            setActiveTab(0);
          }
        }
        console.log(updateAgent, "updateAgent");
        return updateAgent;
      });
    }
  }, [novelMsg]);

  const handleTabChange = (index: number) => {
    if (!agents[index].working) {
      return;
    }
    setActiveTab(index);
  };
  const getStyle = (
    agent: Agent,
    index: number
  ): React.CSSProperties | undefined => {
    if (activeTab == index) {
      return {
        opacity: 1,
        cursor: "pointer",
      };
    }
    if (!agent.working) {
      return {
        opacity: 0.3,
        cursor: "not-allowed",
      };
    } else {
      return {
        opacity: 0.8,
        cursor: "pointer",
      };
    }
  };
  return (
    <div className=" mx-auto">
      {activeTab > -1 && (
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
            style={{ maxHeight: "90vh", minWidth: "220px" }}
          >
            {agents.map((agent, index) => (
              <div key={agent.key} onClick={() => handleTabChange(index)}>
                <div
                  style={getStyle(agent, index)}
                  className={`${
                    activeTab === index ? "active-tab" : ""
                  }  relative list-none cursor-pointer flex gap-4 items-center justify-center agent-sidebar-item`}
                >
                  <div className="flex flex-col gap-3 items-center">
                    <Image
                      src={`/images/${agent.key}.jpeg`}
                      style={{ borderRadius: "100%", overflow: "hidden" }}
                      alt={agent.key}
                      width={80}
                      height={80}
                    />
                    <span className="item-name">{agent.name}</span>
                  </div>
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

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
import { TNovelPrepareWsMsgKeys, TWsMsgDto } from "@/lib/types/api/websocket";
import { cloneDeep } from "lodash-es";
import AgentCard from "./aiAgent/agentCard";

export interface Agent {
  name: string;
  key: string;
  wsMsg: TWsMsgDto;
  working: boolean;
  status: boolean;
}

interface AgentUiProps {
  wsMsgStr: string | null;
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

const keys = Object.keys(AgentTitleKey).filter((key) => !!AgentTitleKey[key]);
const AgentUi: React.FC<AgentUiProps> = ({ wsMsgStr, finishedPrepare }) => {
  const [agents, setAgents] = useState<Agent[]>(
    keys.map((key) => {
      return {
        name: AgentTitleKey[key as TNovelPrepareWsMsgKeys] ?? "",
        key: key,
        working: false,
        status: false,
      } as Agent;
    })
  );
  const [activeTab, setActiveTab] = useState<number>(-1);
  const [preparing, setPreparing] = useState<boolean>(true);

  useEffect(() => {
    if (wsMsgStr) {
      const wsMsgDto = JSON.parse(wsMsgStr) as TWsMsgDto;
      const msgKey = wsMsgDto.msg_key as TNovelPrepareWsMsgKeys;
      if (msgKey === "finish_prepare") {
        return;
      }
      console.log(wsMsgDto, "message");
      setAgents((preAgents) => {
        let updateAgent = cloneDeep(preAgents);
        if (keys.includes(wsMsgDto.msg_key)) {
          const index = updateAgent.findIndex(
            (item) => item.key == wsMsgDto.msg_key
          );
          updateAgent[index] = {
            ...updateAgent[index],
            wsMsg: wsMsgDto,
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
  }, [wsMsgStr]);

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
            <AgentCard
              activeTab={activeTab}
              canEdit={activeTab > 0}
              title={agents?.[activeTab]?.name || ""}
              icon={<FaRobot size={30} />}
              tip={agents?.[activeTab]?.name}
              editCallback={(e) => console.log(e)}
              style={{ maxHeight: "90vh" }}
              agent={agents[activeTab]}
              className="overflow-y-auto overflow-x-hidden"
            ></AgentCard>
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

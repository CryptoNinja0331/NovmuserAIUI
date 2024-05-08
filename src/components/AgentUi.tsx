import React, { useState, useEffect } from "react";
// import aiAgent from '../assets/images/artificial-intelligence 2.png';
import aiAgent from '../assets/images/tick.svg';
import Image from "next/image";
import { FaRobot } from "react-icons/fa6";
import BrainstormingUi from "./aiAgent/BrainstormingUi";
import WorldViewUi from "./aiAgent/WorldViewUi";
import CharacterProfileUi from "./aiAgent/CharacterProfileUi";
import ChapterOutlineUi from "./aiAgent/ChapterOutlineUi";
import PlotUi from "./aiAgent/PlotUi";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

interface Agent {
    name: string;
    novel: string | null;
    working: boolean;
}

interface AgentUiProps {
    novelMsg: string | null;
}

const AgentUi: React.FC<AgentUiProps> = ({ novelMsg, finishedPrepare }) => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [preparing, setPreparing] = useState<boolean>(true);


    useEffect(() => {
        if (novelMsg) {
            const message = JSON.parse(novelMsg);
            if (message.msg_key === "finish_prepare") {
                return;
            }

            setAgents((prevAgents) => {
                const updatedAgents = prevAgents.map((agent) => {
                    if (agent.novel === null) {
                        return { ...agent, novel: novelMsg, working: false };
                    }
                    return agent;
                });

                if (!prevAgents.some((agent) => agent.novel === null)) {
                    return [...prevAgents, { name: `Agent ${prevAgents.length + 1}`, novel: novelMsg, working: false }];
                }

                return updatedAgents;
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
                        <SimpleBar style={{ maxHeight: '90vh' }}>
                            <div className=" bg-[#170F21]  overflow-y-auto overflow-x-hidden agent-card border-2 shadow-md border-input p-6 text-sm rounded-md">
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
                        </SimpleBar>
                    </div>
                    <div className="w-[20%] space-y-4 p-4 bg-[#170F21] shadow-md rounded-md border-input border">
                        {agents.map((agent, index) => (
                            <div
                                key={agent.name}
                                onClick={() => handleTabChange(index)}
                            >
                                <div className={`${activeTab === index ? "active-tab" : ""}  relative list-none cursor-pointer flex gap-4 items-center justify-between agent-sidebar-item`}>
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
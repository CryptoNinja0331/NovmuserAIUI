import React, { useState, useEffect } from "react";

interface Agent {
    name: string;
    novel: string | null;
    working: boolean;
}

interface AgentUiProps {
    novelMsg: string | null;
}

const AgentUi: React.FC<AgentUiProps> = ({ novelMsg }) => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [preparing, setPreparing] = useState<boolean>(true);
    const [workingAgent, setWorkingAgent] = useState<string>("");

    useEffect(() => {
        if (novelMsg) {
            const message = JSON.parse(novelMsg);
            if (message.msg_key === "finish_prepare") {
                // If it's the finish_prepare message, stop creating agents and show "Finished Prepare"
                setPreparing(false);
                return;
            }

            setAgents((prevAgents) => {
                // If the agent already exists, update its novel
                const updatedAgents = prevAgents.map((agent) => {
                    if (agent.novel === null) {
                        return { ...agent, novel: novelMsg, working: false };
                    }
                    return agent;
                });

                // If a new agent's data arrives, add it to the list
                if (!prevAgents.some((agent) => agent.novel === null)) {
                    return [...prevAgents, { name: `Agent ${prevAgents.length + 1}`, novel: novelMsg, working: false }];
                }

                return updatedAgents;
            });
        }
    }, [novelMsg]);

    useEffect(() => {
        if (preparing && agents.length > 0 && workingAgent === "") {
            // Once the first message arrives, update the working agent message
            setWorkingAgent(`next agent is working, please wait...`);
        }
    }, [preparing, agents, workingAgent]);

    const handleTabChange = (index: number) => {
        setActiveTab(index);
    };

    return (
        <>
            <div className="flex">
                <div>
                    {agents.map((agent, index) => (
                        <div
                            className={`${activeTab === index ? "active" : ""} list-none`}
                            key={agent.name}
                            onClick={() => handleTabChange(index)}
                        >
                            {agent.name}
                        </div>
                    ))}
                </div>
                <div>

                    {agents[activeTab] && agents[activeTab].novel !== null ? (
                        agents[activeTab].novel
                    ) : agents[activeTab] && agents[activeTab].working ? (
                        <div>{agents[activeTab].name} is working, please wait...</div>
                    ) : (
                        null
                    )}

                    {preparing ? (
                        <div>{workingAgent || "Agent is working, please wait..."}</div>
                    ) : (
                        <div>Finished Prepare</div>
                    )}
                </div>


            </div>
        </>
    );
};

export default AgentUi;

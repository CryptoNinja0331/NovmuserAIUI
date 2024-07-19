import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { TooltipWrapper } from "@/components/ui/tooltip.tsx";
import { AiOutlineExclamationCircle } from "react-icons/ai"
import { FaRegEdit, FaRegSave } from "react-icons/fa";
import { Agent } from '../AgentUi';
import { AiOutlineBulb } from "react-icons/ai";
import { GiWorld } from "react-icons/gi";
import { FaPeopleRobbery } from "react-icons/fa6";
import { TiFlowMerge } from "react-icons/ti";
import { BsBookHalf } from "react-icons/bs";
import BrainstormingUi from './BrainstormingUi';
import WorldViewUi from './WorldViewUi';
import CharacterProfileUi from './CharacterProfileUi';
import PlotUi from './PlotUi';
import ChapterOutlineUi from './ChapterOutlineUi';
export interface IAgentCardProps {
	icon: React.FC;
	style?: React.CSSProperties;
	className?: string;
	activeTab: number;
	agent: Agent;
	saveHandler: (text: string) => void;
}
type TEditStatus = "prepare" | "edit" | 'save'
const AgentCard: React.FC<PropsWithChildren<IAgentCardProps>> = ({
   children,
	 activeTab,
   style,
   className,
	 agent,
   saveHandler
}) => {
	const [editStatus, updateStatus] = useState<TEditStatus>("prepare")
	const changeEdit = () => {
			if (editStatus == "prepare") {
				updateStatus("edit")
			} else if (editStatus == "edit") {
				updateStatus("save")
			} else if (editStatus == "save") {
				updateStatus("edit")
			}
	}

	const getIcon = useCallback(() => {
		switch (activeTab) {
			case 0:
				return <AiOutlineBulb size={30} color={"#facc15"}/>
			case 1:
				return <GiWorld size={30} color={"#0ea5e9"}/>
			case 2:
				return <FaPeopleRobbery size={30} color={"#f97316"}/>
			case 3:
				return  <TiFlowMerge size={30} color={"#c2da91"}/>
			case 4:
				return <BsBookHalf size={30} color={"#f43f5e"}/>
		}
	}, [activeTab]);
	const getChildCom = useCallback((agent: Agent) => {
		switch (activeTab) {
			case 0:
				return <BrainstormingUi novelMsg={agent.novel} />
			case 1:
				return <WorldViewUi novelMsg={agent.novel} editStatus={editStatus}/>
			case 2:
				return <CharacterProfileUi novelMsg={agent.novel} editStatus={editStatus} />
			case 3:
				return <PlotUi novelMsg={agent.novel}  editStatus={editStatus}/>
			case 4:
				return <ChapterOutlineUi novelMsg={agent.novel} editStatus={editStatus} />
			default:
				return <div>{agent.novel}</div>
		}
	}, [activeTab, editStatus])
	useEffect(() => {
		updateStatus("prepare")
	}, [activeTab])
	return (
		<div style={style} className={`${className} w-full flex flex-col bg-[#170F21] agent-card border-2 shadow-md border-input p-6 text-sm rounded-md`}>
			<div className="title flex">
				<div className="flex align-center justify-center text-center flex-1 text-lg mb-2 font-semibold">
					<div style={{ marginRight: '20px' }} className={"flex align-center"}>
						{getIcon()}
					</div>
					<div className="text-violet-gradient">{agent.name}</div>
				</div>
				{
					activeTab > 0 && <div style={{ marginRight: "20px" }} className="cursor-pointer" onClick={() => changeEdit()}>{
						editStatus == "edit" ? <FaRegSave size={30} color={"#fff"} /> : <FaRegEdit size={30} color={"#fff"} />
					}</div>
				}
				{
					agent.name && (
						<div className="icon">
							<TooltipWrapper tooltipContent={agent.name}>
								<AiOutlineExclamationCircle size={30} color={'#818cf8'} />
							</TooltipWrapper>
						</div>
					)
				}
			</div>
			<div className="flex-1 w-full overflow-y-scroll">
				{getChildCom(agent)}
			</div>
		</div>
	)
}
export default React.memo(AgentCard)

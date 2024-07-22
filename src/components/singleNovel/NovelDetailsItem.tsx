
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AgentCard from '../aiAgent/agentCard';

const displayNames = {
    brain_storming: "Leader Writer",
    world_view: "World Builder",
    characters: "Character Designer",
    chapter_outline: "Plot Designer",
    plot_outline: "Outline Planner",
} as const;

type DisplayNameKeys = keyof typeof displayNames;

interface NovelDetailsItemProps {
    index: number;
    name: DisplayNameKeys;
    data: any; // Adjust the type based on the actual data structure
}

const NovelDetailsItem: React.FC<NovelDetailsItemProps> = ({ name, data, index }) => {
    console.log(name, data, 'NovelDetailsItem')
    return (
        <div
            key={name}
            className="bg-[#150F2D] p-2 tracking-wide rounded-md  cursor-pointer"

        >
            <Dialog>
                <DialogTrigger asChild>
                    <p>{displayNames[name]}</p>
                </DialogTrigger>
                <DialogContent className="max-w-[80vw] w-[60rem] h-[80vh] bg-[#150F2D] text-white ">
                    <AgentCard
                      activeTab={index}
                      agent={{ name: name, wsMsg: {msg: data}}}
                      style={{ maxHeight: "90vh" }}
                      className="overflow-y-auto overflow-x-hidden"
                    />
                </DialogContent>
            </Dialog>
        </div>

    );
};

export default NovelDetailsItem;

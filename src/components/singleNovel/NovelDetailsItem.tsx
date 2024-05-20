
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";








const displayNames = {
    'brain_storming': 'Brain Storming',
    'characters': 'Characters',
    'world_view': 'World View',
    'plot_outline': 'Plot Outline',
    'chapter_outline': 'Chapter Outline'
} as const;

type DisplayNameKeys = keyof typeof displayNames;

interface NovelDetailsItemProps {
    name: DisplayNameKeys;
    data: any; // Adjust the type based on the actual data structure
}

const NovelDetailsItem: React.FC<NovelDetailsItemProps> = ({ name, data }) => {
    const handleClick = () => {
        console.log(data);
    };

    return (
        <div
            key={name}
            className="bg-[#150F2D] tracking-wide rounded-md p-3 cursor-pointer"
            onClick={handleClick}
        >
            <Dialog>
                <DialogTrigger asChild>
                    <p>{displayNames[name]}</p>
                </DialogTrigger>
                <DialogContent className="max-w-[50vw] min-h-[50rem] bg-[#150F2D] text-white">
                    <Textarea defaultValue={data} placeholder="Type your message here." />


                </DialogContent>
            </Dialog>

        </div>
    );
};

export default NovelDetailsItem;
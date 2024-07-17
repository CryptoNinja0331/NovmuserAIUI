
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import SimpleBar from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css';







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

    return (
        <div
            key={name}
            className="bg-[#150F2D] p-2 tracking-wide rounded-md  cursor-pointer"

        >
            <Dialog>
                <DialogTrigger asChild>
                    <p>{displayNames[name]}</p>
                </DialogTrigger>
                <DialogContent className="max-w-[50vw] min-h-[40vh] bg-[#150F2D] text-white ">
                    <SimpleBar style={{ maxHeight: '40vh' }}>
                        <Textarea defaultValue={data} className="!min-h-[60vh] p-4" placeholder="Type your message here." />
                    </SimpleBar>
                </DialogContent>
            </Dialog>
        </div>

    );
};

export default NovelDetailsItem;

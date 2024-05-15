import NovelSidebar from "@/components/singleNovel/NovelSidebar";
import { getSingleNovel } from "@/lib/apiCall/server/getSingleNovel";

// Define interfaces
interface NovelDetails {
    brain_storming: null;
    chapter_outline: null;
    characters: null;
    plot_outline: null;
    world_view: null;
}

interface NovelMetadata {
    name: string;
    requirements: string;
    author_id: string;
    created_at: string;
    status: string;
    updated_at: string;
}

interface Novel {
    id: string;
    content: null;
    details: NovelDetails;
    metadata: NovelMetadata;
}


interface Chapter {
    chapter_number: string;
    title: string;
    summary: string;
    major_events: string[];
    conflict: string;
    emotional_development: string;
    revealed_information: string | null;
    chapter_end: string;
    characters: string[];
}





export async function generateMetadata({ params }: { params: { novelId: string } }) {
    let novel = await getSingleNovel(params.novelId);
    return {
        title: novel?.data?.metadata?.name,
        description: novel?.data?.metadata?.requirements,
    };
}

// Page component
export default async function Page({ params }: { params: { novelId: string } }) {
    let response = await getSingleNovel(params.novelId);

    return <div className="h-[calc(100%-50px)]">
        <p className="text-white border-b border-input pb-2 capitalize text-[1.1rem] px-2">{response?.data?.metadata?.name}</p>
        <div className="text-white relative flex justify-between items-center h-[calc(100%-40px)]">
            <div className=" inline-block w-[16rem] h-full border-r border-input">
                <h1>Chapter List</h1>
                <ul>
                    {
                        response.data.details?.chapter_outline?.chapters.map((item: Chapter) => (
                            <li key={item?.chapter_number}>
                                {item?.chapter_number}
                                <span>{item?.title}</span>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="relative">
                <NovelSidebar novelDetails={response.data.details} />
            </div>
        </div>

    </div>;
}


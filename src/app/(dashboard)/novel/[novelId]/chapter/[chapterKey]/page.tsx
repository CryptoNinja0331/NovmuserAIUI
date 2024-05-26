import ChapterDetails from "./ChapterDetails";

const page = ({ params }: { params: { chapterKey: string } }) => {

    return (

        <div className="h-[calc(100%-50px)]">

            <ChapterDetails params={params} />
            <div className="relative mt-2">

            </div>
        </div>

    )
};

export default page;
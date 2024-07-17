import React from 'react';

interface Character {
    name: string;
    description: string;
}

interface Chapter {
    chapter_number: number;
    title: string;
    summary: string;
    major_events: string[];
    characters: Character[];
    conflict: string;
    emotional_development: string;
    revealed_information: string;
    chapter_end: string;
}

interface ChapterOutlineData {
    chapters: Chapter[];
}

interface ChapterOutlineUiProps {
    novelMsg: any | null;
}

const ChapterOutlineUi: React.FC<ChapterOutlineUiProps> = ({ novelMsg }) => {
    const data: ChapterOutlineData = novelMsg.msg;

    const renderCharacters = (characters: Character[]) => {
        return characters?.map((character, index) => (
            <div key={index} className="bg-gray-100 rounded-md p-4 shadow-md mb-2">
                <h4 className="text-lg font-semibold mb-2">{character.name}</h4>
                <p>{character.description}</p>
            </div>
        ));
    };

    return (
        <div className=" mx-auto">
            <h2 className="text-2xl font-bold mb-4">Chapter Outline</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                {data.chapters?.map((chapter, index) => (
                    <div key={index} className="bg-white text-black rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">
                            Chapter {chapter.chapter_number}: {chapter.title}
                        </h3>
                        <p className="mb-4">{chapter.summary}</p>
                        <div className="mb-4">
                            <h4 className="text-lg font-semibold mb-2">Major Events:</h4>
                            <ul className="list-disc list-inside">
                                {chapter.major_events?.map((event, eventIndex) => (
                                    <li key={eventIndex}>{event}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-4">
                            <h4 className="text-lg font-semibold mb-2">Characters:</h4>
                            {renderCharacters(chapter.characters)}
                        </div>
                        <p className="mb-2">Conflict: {chapter.conflict}</p>
                        <p className="mb-2">Emotional Development: {chapter.emotional_development}</p>
                        <p className="mb-2">Revealed Information: {chapter.revealed_information}</p>
                        <p>Chapter End: {chapter.chapter_end}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChapterOutlineUi;

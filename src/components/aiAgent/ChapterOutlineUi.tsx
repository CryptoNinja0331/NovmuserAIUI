import React from 'react';

interface ChapterOutlineUiProps {
    novelMsg: string | null;
}

const ChapterOutlineUi: React.FC<ChapterOutlineUiProps> = ({ novelMsg }) => {
    return (
        <div>
            <h2>Chapter Outline</h2>
            {/* Your Chapter Outline UI components */}
            <div>{novelMsg}</div>
            {/* Add your chapter outline components here */}
        </div>
    );
};

export default ChapterOutlineUi;
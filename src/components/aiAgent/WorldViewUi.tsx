import React from 'react';

interface WorldViewUiProps {
    novelMsg: string | null;
}

const WorldViewUi: React.FC<WorldViewUiProps> = ({ novelMsg }) => {
    return (
        <div>
            <h2>World View</h2>
            {/* Your World View UI components */}
            <div>{novelMsg}</div>
            {/* Add your world view components here */}
        </div>
    );
};

export default WorldViewUi;
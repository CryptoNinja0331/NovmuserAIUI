import React from 'react';

interface CharacterProfileUiProps {
    novelMsg: string | null;
}

const CharacterProfileUi: React.FC<CharacterProfileUiProps> = ({ novelMsg }) => {
    return (
        <div>
            <h2>Character Profile</h2>
            {/* Your Character Profile UI components */}
            <div>{novelMsg}</div>
            {/* Add your character profile components here */}
        </div>
    );
};

export default CharacterProfileUi;
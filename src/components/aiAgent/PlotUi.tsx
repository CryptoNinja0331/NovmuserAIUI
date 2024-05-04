import React from 'react';

interface PlotUiProps {
    novelMsg: string | null;
}

const PlotUi: React.FC<PlotUiProps> = ({ novelMsg }) => {
    return (
        <div>
            <h2>Plot</h2>
            {/* Your Plot UI components */}
            <div>{novelMsg}</div>
            {/* Add your plot components here */}
        </div>
    );
};

export default PlotUi;
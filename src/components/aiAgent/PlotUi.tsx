import React from 'react';
import 'react-vertical-timeline-component/style.min.css';

interface PlotUiProps {
    novelMsg: string | null;
}

const PlotUi: React.FC<PlotUiProps> = ({ novelMsg }) => {
    const dataMain = JSON.parse(novelMsg || '{}');
    const data = JSON.parse(dataMain.msg || '{}');
    console.log(data);

    const renderSubplots = (subplots) => {
        return subplots?.map((subplot, index) => (
            <div key={index} className="bg-gray-100 rounded-md p-4 shadow-md mb-4">
                <h4 className="text-lg font-semibold mb-2">Plot: {subplot?.plot}</h4>
                <p className="mb-2">Involved Characters: {subplot?.involved_characters?.join(', ')}</p>
                <p>Expected Impact: {subplot?.expected_impact}</p>
            </div>
        ));
    };

    const plotData = [
        {
            title: 'Beginning',
            description: (
                <div>
                    <p className="mb-2">Event: {data?.beginning?.event}</p>
                    <p className="mb-2">
                        Main Characters:
                        {data?.beginning.main_characters?.map((item, index) => (
                            <span key={index} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold mr-2">
                                {item}
                            </span>
                        ))}
                    </p>
                    <p>Scene: {data?.beginning.scene}</p>
                </div>
            ),
        },
        {
            title: 'Development',
            description: (
                <div>
                    <p className="mb-2">Conflict Expansion: {data?.development?.conflict_expansion}</p>
                    <p className="mb-2">Inciting Incident: {data?.development?.inciting_incident}</p>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Subplots:</h3>
                        {renderSubplots(data?.development?.subplots)}
                    </div>
                </div>
            ),
        },
        {
            title: 'Climax',
            description: (
                <div>
                    <p className="mb-2">Key Turn: {data?.climax?.key_turn}</p>
                    <p className="mb-2">Decisions: {data?.climax?.decisions}</p>
                    <p>Consequences: {data?.climax?.consequences}</p>
                </div>
            ),
        },
        {
            title: 'Ending',
            description: (
                <div>
                    <p className="mb-2">Character Outcomes: {data?.ending?.character_outcomes}</p>
                    <p className="mb-2">Conflict Resolution: {data?.ending?.conflict_resolution}</p>
                    <p className="mb-2">Loose Ends: {data?.ending?.loose_ends}</p>
                    <p>World State: {data?.ending?.world_state}</p>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Plot</h2>
            <section className="timeline-landing">
                <div className="row container">
                    <div className="timeline">
                        <div className="timeline-line" />
                        {plotData.map((event, index) => (
                            <div key={index} className="timeline-event">
                                <div className="timeline-event-content bg-white rounded-lg shadow-md p-6">
                                    <div className="event-details">
                                        <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
                                        {event.description}
                                    </div>
                                </div>
                                {index < plotData.length - 1 && <div className="timeline-connector" />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PlotUi;
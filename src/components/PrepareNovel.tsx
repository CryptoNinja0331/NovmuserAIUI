import { Button } from './ui/button';
import Image from "next/image";
import prepareImage from '../assets/images/writter.svg';
import { useEffect, useState } from 'react';
import AgentUi from './AgentUi';
const PrepareNovel: React.FC<{ novelId: string }> = ({ novelId }) => {

    const [prepareNovel, setPrepareNovel] = useState<any>(null);
    const [finishedPrepare, setFinishPreapre] = useState<any>(null)
    const [novelMsg, setNovelMsg] = useState()

    useEffect(() => {
        const socketUrl = `ws://novmuser-api-test.us-east-1.elasticbeanstalk.com/novel/preparing/${novelId}/ws`;
        const newWebsocket = new WebSocket(socketUrl);
        newWebsocket.onopen = () => {
            console.log('WebSocket connection opened');
            setFinishPreapre(true)

        };

        newWebsocket.onmessage = (event) => {
            setNovelMsg(event.data)


        };

        newWebsocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        newWebsocket.onclose = () => {
            console.log('WebSocket connection closed');
            setFinishPreapre(false)

        };


    }, [novelId])



    const handlePrepareNovel = async () => {

        const url = `http://novmuser-api-test.us-east-1.elasticbeanstalk.com/novel/prepare/${novelId}/task`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers if needed
                },
                // No need to include body for an empty payload
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();
            // console.log('Response data:', data);
            setPrepareNovel(data)
            // Handle the response data as needed
        } catch (error) {
            console.error('Error:', error);
            // Handle errors
        }
    };

    return (
        <div className="text-white p-4">

            {
                prepareNovel?.success ?
                    <AgentUi finishedPrepare={finishedPrepare} novelMsg={novelMsg} />
                    : <div>
                        <Image className="mx-auto" style={{ width: '36%' }} src={prepareImage} alt="prepare image " />
                        <div className="text-center mt-8">
                            <Button className="button-gradient-2" onClick={handlePrepareNovel}>Prepare Novel</Button>
                        </div>
                    </div>
            }




        </div>
    );
};

export default PrepareNovel;
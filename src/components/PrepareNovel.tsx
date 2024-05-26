import { Button } from './ui/button';
import Image from "next/image";
import prepareImage from '../assets/images/writter.svg';
import { useEffect, useState } from 'react';
import AgentUi from './AgentUi';
import { useAuth } from '@clerk/nextjs';
import { clientApi } from '@/lib/apiCall/client/clientAPi';

import { useDispatch } from 'react-redux';

interface PrepareNovelResponse {
    success: boolean;
    // Add other properties of the response object here
}

const PrepareNovel: React.FC<{ novelId: string }> = ({ novelId }) => {
    const [prepareNovel, setPrepareNovel] = useState<PrepareNovelResponse | null>(null);
    const [finishedPrepare, setFinishedPrepare] = useState<boolean>(false);
    const [novelMsg, setNovelMsg] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);

    const { isLoaded, getToken } = useAuth();

    useEffect(() => {
        const socketUrl = `wss://api-dev.novmuserai.com/novel/preparing/${novelId}/ws`;

        async function getAuthToken() {
            if (!isLoaded) {
                return null;
            }
            const token = await getToken({ template: 'UserToken' });
            return token;
        }

        async function connectWebSocket() {
            const authToken = await getAuthToken();
            if (!authToken) {
                console.error('Failed to obtain auth token');
                return;
            }

            const newWebsocket = new WebSocket(socketUrl, [authToken]);

            newWebsocket.onopen = () => {
                console.log('WebSocket connection opened');
                setFinishedPrepare(true);
            };

            newWebsocket.onmessage = (event) => {
                console.log(event.data);
                setNovelMsg(event.data);
            };

            newWebsocket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            newWebsocket.onclose = () => {
                console.log('WebSocket connection closed');
                setFinishedPrepare(false);
            };

            return () => {
                newWebsocket.close();
            };
        }

        connectWebSocket();
    }, [isLoaded, getToken, novelId]);


















    return (
        <div className="text-white p-4">
            {prepareNovel?.success ? (
                <AgentUi finishedPrepare={finishedPrepare} novelMsg={novelMsg} />
            ) : (
                <div>
                    <Image className="mx-auto" style={{ width: '36%' }} src={prepareImage} alt="prepare image " />
                    <div className="text-center mt-8">
                        <PrepareButton setPrepareNovel={setPrepareNovel} novelId={novelId} />

                    </div>
                </div>
            )}
        </div>
    );
};

export default PrepareNovel;


const PrepareButton: React.FC<{ setPrepareNovel: (data: any) => void; novelId: string }> = ({
    setPrepareNovel,
    novelId,
}) => {
    const dispatch = useDispatch();



    dispatch(clientApi.util.invalidateTags(['novelData']));
    const { isLoaded, getToken } = useAuth();

    const handlePrepareNovel = async () => {
        const userId = await getToken({ template: "UserToken" });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/novel/prepare/${novelId}/task`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userId}`,
                },
            });





            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();


            setPrepareNovel(data);





        } catch (error) {
            console.error('Error:', error);
            // Handle errors, e.g., show an error message to the user
        }
    };
    return (<Button className='bg-bluish' onClick={handlePrepareNovel}>Prepare Novel</Button>)
}
import Image from 'next/image';
import React from 'react';
import brainImage from '../../assets/images/creative-brain.png';

interface BrainstormingUiProps {
    novelMsg: any | null;
}

const BrainstormingUi: React.FC<BrainstormingUiProps> = ({ novelMsg }) => {
    const msg = novelMsg ? novelMsg.msg : '';
    return (
        <div className='w-full    '>
            {/* <div className='bubble' /> */}


            <div className='flex items-center justify-between my-4'>
                <h1 className='text-violet-gradient text-xl mb-2 font-semibold'>Brainstorming</h1>
                <Image src={brainImage} alt="ai gent" width={50} height={50} />
            </div>


            {/* Your Brainstorming UI components */}
            <div className='whitespace-pre-wrap  h-[100%] overflow-y-auto'>{msg}</div>
            {/* Add your brainstorming components here */}
        </div>
    );
};

export default BrainstormingUi;
